import { Component } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";

class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exam: null,
      loading: true,
      error: false,
      currentDuration: 50,
    };
    this.url = process.env.REACT_APP_BE_URL;
  }

  fetchData = async () => {
    const search = this.props.location.search;
    const name = new URLSearchParams(search).get("name");

    const examInfo = {
      candidateName: name,
      name: "Admission Test",
      totalDuration: 30,
    };

    const startUlr = this.url + "/exams/start";
    console.log(startUlr);

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
        this.setState({ exam: exam, loading: false });
      }
    } catch (error) {
      this.setState({ error: true, loading: false });
    }
  };

  componentDidMount = () => {
    this.fetchData();
  };

  render() {
    const { error, loading, exam } = this.state;
    return (
      <Container>
        {loading && <Spinner animation="border" variant="warning" />}
        {error && <Alert variant="danger">This is a alert—check it out!</Alert>}
        {exam && (
          <>
            <h2>Question</h2>
            {exam.questions.map((question) => {
              console.log(question);
            })}
          </>
        )}
      </Container>
    );
  }
}

export default Start;
