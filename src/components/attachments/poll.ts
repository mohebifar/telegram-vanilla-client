import {
  MessageMediaPoll,
  PollAnswer,
  PollAnswerVoters,
} from "../../core/tl/TLObjects";
import { TelegramClientProxy } from "../../telegram-worker-proxy";
import { Component, createElement } from "../../utils/dom";
import * as styles from "../chat/chat.scss";
import Icon, { Icons } from "../ui/icon";

export interface Options {
  media: MessageMediaPoll;
  tg: TelegramClientProxy;
}

export default class PollAttachment implements Component<Options> {
  public readonly element: HTMLElement;

  constructor({ media }: Options) {
    const { poll, results } = media;
    const anonymous = !poll.publicVoters;
    const isQuiz = !!poll.quiz;

    const heading = createElement(
      "div",
      { class: styles.heading },
      createElement("div", { class: styles.question }, poll.question),
      anonymous ? createElement("div", "Anonymous Poll") : ""
    );

    const answerVoters: PollAnswerVoters[] | undefined = results.results;

    const renderAnswer = answerVoters
      ? (answer: PollAnswer, index: number) => {
          const answerVoter = answerVoters[index];
          const percent = Math.round(
            (answerVoter.voters / results.totalVoters) * 100
          );
          const correct = isQuiz ? !answerVoter.chosen && answerVoter.correct : true;

          return createElement(
            "div",
            { class: styles.answer + ' ' + (correct ? '' : styles.wrong) },
            createElement("div", { class: styles.voters }, `${percent}%`),
            createElement("div", answer.text),
            createElement(
              "div",
              { class: styles.progressWrapper },
              createElement(
                "div",
                { class: styles.icon },
                createElement(Icon, { icon: correct ? Icons.Check : Icons.Close, color: "white" })
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
      : (answer: PollAnswer) => {
          return createElement(
            "div",
            { class: styles.answer },
            createElement("button"),
            createElement("div", answer.text)
          );
        };

    const answers = createElement("div", ...poll.answers.map(renderAnswer));

    const answersWrapper = createElement(
      "div",
      { class: styles.answersWrapper },
      answers
    );

    const element = createElement(
      "div",
      { class: styles.pollWrapper },
      heading,
      answersWrapper,
      createElement(
        "div",
        { class: styles.footer },
        results.totalVoters ? `${results.totalVoters} answered` : 'No votes yet'
      )
    );

    this.element = element;
  }
}
