import { Component } from "react";
import { Container, Spinner, Alert, Col, Row } from "react-bootstrap";

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

  timer = () => {
    setInterval(() => {
      this.setState({ currentDuration: this.state.currentDuration - 1 });
      console.log(this.state.currentDuration);
      if (this.state.currentDuration === 0) {
        this.submitQuestion();
      }
    }, 1000);
  };

  fetchData = async () => {
    const search = this.props.location.search;
    const name = new URLSearchParams(search).get("name");

    const examInfo = {
      candidateName: name,
      name: "Admission Test",
      totalDuration: 30,
    };

    const startUlr = this.BE_URL + "/exams/start";
    try {
      const res = await fetch(startUlr, {
        method: "POST",
        body: JSON.stringify(examInfo),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });

      if (res.ok) {
        const exam = await res.json();
        this.setState({
          exam: exam,
          loading: false,
          currentQuestion: exam.questions[0],
          currentDuration: exam.questions[0].duration,
        });

        // console.log(this.state.currentQuestion);
      }
    } catch (error) {
      this.setState({ error: true, loading: false });
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
          const examWithAns = { ...this.state.exam, questions: data };
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

  componentDidMount = () => {
    this.fetchData();
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
                    <h4>
                      {providedAnswer.question + 1}/{exam.questions.length}{" "}
                      {exam.name}
                    </h4>
                    <div className="border-bottom">
                      Time Remaining:{" "}
                      <h2 style={{ display: "inline" }}>{currentDuration}</h2>
                    </div>
                  </div>
                  <br />
                  <h2>Question {providedAnswer.question + 1}</h2>

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
                    <h1>Your Result: {console.log(exam.score)}</h1>
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
