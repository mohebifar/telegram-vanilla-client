import {
  MessageMediaPoll,
  PollAnswer,
  PollAnswerVoters,
  Updates,
} from "../../core/tl/TLObjects";
import { Component, createElement, on, removeChildren } from "../../utils/dom";
import Icon, { Icons } from "../ui/icon";
import { IMessage } from "../../models/message";
import { getInputPeer } from "../../core/tl/utils";

import * as styles from "../chat/chat.scss";
import { handleUpdate } from "../../update-handler";

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
    const isSingleChoice = !poll.multipleChoice;

    const heading = createElement(
      "div",
      { class: styles.heading },
      createElement("div", { class: styles.question }, poll.question),
      anonymous ? createElement("div", "Anonymous Poll") : ""
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
            (answerVoter.voters / results.totalVoters) * 100
          );
          const correct = isQuiz
            ? !answerVoter.chosen && answerVoter.correct
            : true;

          return createElement(
            "div",
            { class: styles.answer + " " + (correct ? "" : styles.wrong) },
            createElement("div", { class: styles.voters }, `${percent}%`),
            createElement("div", answer.text),
            createElement(
              "div",
              { class: styles.progressWrapper },
              createElement(
                "div",
                { class: styles.icon },
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

    const answers = createElement("div", ...poll.answers.map(renderAnswer));

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
