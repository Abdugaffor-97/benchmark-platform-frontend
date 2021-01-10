import { Component } from "react";
import { Container, Spinner, Alert, Col, Row } from "react-bootstrap";
import { fetchExam } from "../helperFunctions/fetcherFuncs";
import { Typography, makeStyles, colors } from "@material-ui/core";
import Question from "./Question";
import red from "@material-ui/core/colors/red";

// const usestyles = makeStyles(
//   (theme = {
//     timeTemain: red,
//   })
// );

class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exam: null,
      loading: true,
      error: false,
      currentQuestion: null,
      providedAnswer: { question: 0, answer: null },
      currentDuration: 0,
    };
    this.BE_URL = process.env.REACT_APP_BE_URL;
  }

  updateProvidedAns = () => {};

  timer = () => {
    setInterval(() => {
      this.setState({ currentDuration: this.state.currentDuration - 1 });
      if (this.state.currentDuration === 0) {
        this.submitQuestion();
      }
    }, 1000);
  };

  startExam = async () => {
    const status = await fetchExam(this.BE_URL);
    if (status.exam) {
      this.setState({
        exam: status.exam,
        loading: false,
        currentQuestion: status.exam.questions[0],
        currentDuration: status.exam.questions[0].duration,
      });
    } else if (status.error) {
      this.setState({ error: true, loading: false });
    } else if (status.status) {
      this.setState({ error: status.status, loading: false });
    }
  };

  submitQuestion = async (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState({ loading: true });
    const providedAns = this.state.providedAnswer;
    const submitUrl = this.BE_URL + `/exams/${this.state.exam._id}/answer`;
    try {
      const res = await fetch(submitUrl, {
        method: "POST",
        body: JSON.stringify(providedAns),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });
      if (res.ok) {
        providedAns.question += 1;
        this.setState({
          loading: false,
          providedAnswer: providedAns,
          currentQuestion: this.state.exam.questions[providedAns.question],
        });

        if (providedAns.question === this.state.exam.questions.length) {
          const data = await res.json();
          const examWithAns = {
            ...this.state.exam,
            questions: data.questions,
            score: data.score,
          };
          // console.log(data);
          this.setState({ exam: examWithAns });
        }
      } else {
        this.setState({ loading: false, error: res.statusText });
      }
    } catch (error) {
      this.setState({
        error: error.text,
      });
    }
  };

  componentDidMount = async () => {
    this.startExam();
    this.timer();
  };

  render() {
    const {
      error,
      loading,
      exam,
      currentQuestion,
      providedAnswer,
      currentDuration,
    } = this.state;
    return (
      <Container>
        <Row className="mx-1 my-5">
          {exam && (
            <>
              {currentQuestion ? (
                <>
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <div
                      className="border-bottom my-3"
                      style={{ color: "#00FF84" }}
                    >
                      <Typography
                        variant="h4"
                        style={{ display: "inline", color: "red" }}
                      >
                        {providedAnswer.question + 1}/{exam.questions.length}{" "}
                      </Typography>

                      <b>{exam.name}</b>
                    </div>
                    <div className="border-bottom">
                      <b style={{ color: "#00FF84" }}>Time Remaining: </b>{" "}
                      <Typography
                        variant="h4"
                        style={{ display: "inline", color: "red" }}
                      >
                        {currentDuration}
                      </Typography>
                    </div>
                  </div>
                  <br />
                  <Typography variant="h4">
                    Question {providedAnswer.question + 1}
                  </Typography>
                  <Question
                    currentQuestion={currentQuestion}
                    providedAnswer={providedAnswer}
                    submitQuestion={this.submitQuestion}
                    setState={this.setState}
                    // providedAnswer,
                    // submitQuestion,
                  />

                  <p>{currentQuestion.text}</p>
                  <br />
                  <form onSubmit={this.submitQuestion}>
                    <p>Select your answer:</p>
                    {currentQuestion.answers.map((ans, idx) => (
                      <Col key={idx}>
                        <input
                          type="radio"
                          id={idx}
                          name={providedAnswer.question}
                          value={ans.text}
                          onChange={() => {
                            this.setState({
                              providedAnswer: {
                                ...this.state.providedAnswer,
                                answer: idx,
                              },
                            });
                          }}
                        />
                        {"  "}
                        <label htmlFor={idx}>{ans.text}</label>
                        <br></br>
                      </Col>
                    ))}
                    <input type="submit" value="Submit" />
                  </form>
                </>
              ) : (
                <div>
                  <div>
                    <Typography variant="h3">
                      Your Result: {exam.score}
                    </Typography>
                  </div>

                  {exam.questions.map((question, idx) => (
                    <div className="my-4" key={idx}>
                      <h4>Question {idx + 1}</h4>
                      {/* <p>{JSON.stringify(question)}</p> */}
                      <div className="my-1">
                        Duration: {question.duration} sec
                      </div>
                      <div className="my-1">Question: {question.text}</div>
                      <div className="my-1">
                        Provided Answer:{" "}
                        {question.providedAnswer !== null ? (
                          <b
                            className={
                              question.answers[question.providedAnswer]
                                .isCorrect
                                ? "text-success"
                                : "text-danger"
                            }
                          >
                            {question.answers[question.providedAnswer].text}
                          </b>
                        ) : (
                          <b className="text-danger">Answer did not provided</b>
                        )}
                      </div>
                      <div className="my-1">
                        Correct answer:
                        <b className="text-info">ANS</b>
                        {/* {question.answers.find((ans) => ans.isCorrect)} */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {loading && <Spinner animation="border" variant="warning" />}
        </Row>
        {error && <Alert variant="danger">{error}</Alert>}
      </Container>
    );
  }
}

export default Start;
