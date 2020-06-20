import {
  MessageMediaPoll,
  PollAnswer,
  PollAnswerVoters,
  Updates,
} from "../../core/tl/TLObjects";
import { Component, createElement, on, removeChildren } from "../../utils/dom";
import Icon, { Icons } from "../ui/icon";
import { IMessage, Message } from "../../models/message";
import { getInputPeer } from "../../core/tl/utils";

import * as styles from "../chat/chat.scss";
import { handleUpdate } from "../../update-handler";
import { Peer } from "../../models/peer";
import Avatar from "../ui/avatar";

export interface Options {
  media: MessageMediaPoll;
  message: IMessage;
}

export default class PollAttachment implements Component<Options> {
  public readonly element: HTMLElement;

  constructor({ media, message }: Options) {
    const { poll, results } = media;
    const anonymous = !poll.publicVoters;
    const isQuiz = !!poll.quiz;
    const isSingleChoice = !poll.multipleChoice || poll.quiz;

    if (
      "media" in message &&
      message.media &&
      message.media.$t === "MessageMediaPoll"
    ) {
      Message.pollToMessage.set(message.media.poll.id, message);
    }

    let resultElement: HTMLElement;

    if (anonymous) {
      resultElement = createElement("div", "Anonymous Poll");
    } else if (results.recentVoters) {
      const recentVotersWrapper = createElement("div", {
        class: styles.recentVoters,
      });
      resultElement = createElement(
        "div",
        { style: { display: "flex" } },
        createElement("div", { style: { marginRight: "0.5em" } }, "Poll"),
        recentVotersWrapper
      );

      Peer.bulkGet(
        results.recentVoters.map((id) => ({
          id,
          type: "User",
        }))
      ).then((users) => {
        recentVotersWrapper.append(
          ...users.map((peer) => createElement(Avatar, { peer, size: "xxs" }))
        );
      });
    }

    const heading = createElement(
      "div",
      { class: styles.heading },
      createElement("div", { class: styles.question }, poll.question),
      createElement(
        "div",
        resultElement,
        results.solution
          ? createElement(
              "span",
              {
                class: "tooltip " + styles.solution,
                title: results.solution,
              },
              createElement(Icon, {
                icon: Icons.Tip,
                color: "blue",
              })
            )
          : ""
      )
    );

    const answerVoters: PollAnswerVoters[] | undefined = results.results;

    let optionsSelected: Uint8Array[] = [];

    const getButton = (answer: PollAnswer) => {
      const index = poll.answers.indexOf(answer);
      return this.element.querySelector(`[data-btn-id="${index}"]`);
    };

    const handleSelect = (answer: PollAnswer) => {
      const btn = getButton(answer);

      if (isSingleChoice) {
        const selectedButtons = poll.answers.filter((answer) =>
          optionsSelected.includes(answer.option)
        );
        optionsSelected = [answer.option];
        selectedButtons.forEach(handleUnselect);
      } else {
        optionsSelected.push(answer.option);
      }

      btn.classList.add(styles.active);
      voteButton();
    };

    const handleUnselect = (answer: PollAnswer) => {
      const btn = getButton(answer);
      optionsSelected = optionsSelected.filter(
        (option) => option !== answer.option
      );
      btn.classList.remove(styles.active);

      if (optionsSelected.length === 0) {
        footerInfo();
      }
    };

    const renderAnswer = answerVoters
      ? (answer: PollAnswer, index: number) => {
          const answerVoter = answerVoters[index];
          const percent = Math.round(
            results.totalVoters
              ? (answerVoter.voters / results.totalVoters) * 100
              : 0
          );
          const correct = isQuiz ? answerVoter.correct : true;

          return createElement(
            "div",
            {
              class:
                `${styles.answer} ${styles.voted} ` +
                (correct || !answerVoter.chosen ? "" : styles.wrong),
            },
            createElement("div", { class: styles.voters }, `${percent}%`),
            createElement("div", answer.text),
            createElement(
              "div",
              { class: styles.progressWrapper },
              createElement(
                "div",
                {
                  class:
                    styles.icon +
                    " " +
                    (!answerVoter.chosen && !answerVoter.correct
                      ? styles.invisible
                      : ""),
                },
                createElement(Icon, {
                  icon: correct ? Icons.Check : Icons.Close,
                  color: "white",
                })
              ),
              createElement(
                "div",
                { class: styles.barWrapper },
                createElement("div", {
                  class: styles.bar,
                  style: { width: `${percent}%` },
                })
              )
            )
          );
        }
      : (answer: PollAnswer, index: number) => {
          const id = `poll_${poll.id}_${answer.option}`;
          const button = createElement("button", { "data-btn-id": index, id });

          on(button, "click", () => {
            const fn = optionsSelected.includes(answer.option)
              ? handleUnselect
              : handleSelect;

            fn(answer);
          });

          return createElement(
            "div",
            { class: styles.answer },
            button,
            createElement("label", { for: id }, answer.text)
          );
        };

    const answers = createElement("div", ...(poll.answers || []).map(renderAnswer));

    const answersWrapper = createElement(
      "div",
      { class: styles.answersWrapper },
      answers
    );

    const footer = createElement("div", { class: styles.footer });

    const footerInfo = () => {
      removeChildren(footer);
      footer.append(
        results.totalVoters ? `${results.totalVoters} answered` : "No votes yet"
      );
    };

    const voteButton = () => {
      removeChildren(footer);
      const submitButton = createElement("button", "Vote") as HTMLButtonElement;
      on(submitButton, "click", async () => {
        try {
          submitButton.disabled = true;
          const result = (await message.tg.invoke({
            $t: "messages_SendVoteRequest",
            options: optionsSelected,
            msgId: message.id,
            peer: getInputPeer(await message.getPeer()),
          })) as Updates;

          handleUpdate(result);
        } catch {
          submitButton.disabled = false;
        }
      });
      footer.append(submitButton);
    };

    footerInfo();

    const element = createElement(
      "div",
      { class: styles.pollWrapper },
      heading,
      answersWrapper,
      footer
    );

    this.element = element;
  }
}
