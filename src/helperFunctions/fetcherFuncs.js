const fetchExam = async (url) => {
  // const search = this.props.location.search;
  const name = new URLSearchParams(window.location.search).get("name");

  const examInfo = {
    candidateName: name,
    name: "Admission Test",
    totalDuration: 30,
  };

  const startUlr = url + "/exams/start";
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
      return { exam };
    } else {
      return { status: res.status };
    }
  } catch (error) {
    return { error };
  }
};

const sendQuestion = async (url, providedAns) => {
  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(providedAns),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    return res;
  } catch (error) {
    return error;
  }
};

export { fetchExam, sendQuestion };
