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
          currentQuestion: exam.questions[0],
        });
        console.log(this.state.currentQuestion);
      }
    } catch (error) {
      this.setState({ error: true, loading: false });
    }
  };

  submitQuestion = async (e) => {
    e.preventDefault();
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
      console.log(res);
      if (res.ok) {
        providedAns.question += 1;
        console.log(providedAns);
        this.setState({
          loading: false,
          providedAnswer: providedAns,
          currentQuestion: this.state.exam.questions[providedAns.question],
        });
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
  };

  render() {
    const {
      error,
      loading,
      exam,
      currentQuestion,
      providedAnswer,
    } = this.state;
    return (
      <Container>
        <Row>
          {exam && (
            <>
              <div className="d-flex justify-content-between w-100">
                <h3>{currentQuestion.duration}</h3>
                <h3>
                  {providedAnswer.question + 1}/{exam.questions.length}
                </h3>
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
          )}
          {loading && <Spinner animation="border" variant="warning" />}
        </Row>
        {error && <Alert variant="danger">{error}</Alert>}
      </Container>
    );
  }
}

export default Start;
