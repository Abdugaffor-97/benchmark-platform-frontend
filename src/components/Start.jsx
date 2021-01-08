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
    };
    this.BE_URL = process.env.REACT_APP_BE_URL;
  }

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
          currentQuestion: exam.questions[this.state.providedAnswer.question],
        });
      }
    } catch (error) {
      this.setState({ error: true, loading: false });
    }
  };

  submitQuestion = async (e) => {
    e.preventDefault();
    const submitUrl = this.BE_URL + `/${this.state.exam._id}/answer`;
    try {
      const res = await fetch(submitUrl, {
        method: "POST",
        body: JSON.stringify(this.state.providedAnswer),
      });
    } catch (error) {
      this.setState({
        error: "Error occured while submitting answer. Try again",
      });
    }
  };

  componentDidMount = () => {
    this.fetchData();
  };

  render() {
    const {
      error,
      loading,
      exam,
      currentQuestion,
      providedAnswer,
    } = this.state;
    console.log("currentQuestion", currentQuestion);
    return (
      <Container>
        {error && <Alert variant="danger">This is a alert—check it out!</Alert>}
        <Row>
          {loading && <Spinner animation="border" variant="warning" />}
          {exam && (
            <>
              <div className="d-flex justify-content-between w-100">
                <h3>{currentQuestion.duration}</h3>
                <h3>
                  {providedAnswer.question + 1}/{exam.questions.length}
                </h3>
              </div>
              <br />
              <h2>Question {1}</h2>

              <p>{currentQuestion.text}</p>
              <br />
              <form>
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
          )}
        </Row>
      </Container>
    );
  }
}

export default Start;
