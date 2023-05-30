import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { TextField, Select, MenuItem, Button, FormControl, InputLabel } from '@material-ui/core';
import ErrorPopup from './ErrorPopup';

function EditQuestion ({ token }) {
  const params = useParams();
  const [questionData, setQuestionData] = React.useState('');
  const [type, setType] = useState('single');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [points, setPoints] = useState('');
  const [url, setUrl] = useState('');
  const [options, setOptions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [errorMessage, setErrorMessage] = React.useState('');
  const navigate = useNavigate();

  async function fetchOriginalData () {
    const response = await fetch(`http://localhost:5005/admin/quiz/${params.quizId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    })
    const data = await response.json();
    const questionData = data.questions.find((question) => question.id === Number(params.questionId));
    setQuestionData(questionData);
  }

  useEffect(() => {
    fetchOriginalData();
  }, []);

  useEffect(() => {
    if (questionData) {
      setType(questionData.type);
      setDescription(questionData.description);
      setTime(questionData.time);
      setPoints(questionData.points);
      setUrl(questionData.url);
      setOptions(questionData.options);
      setAnswers(questionData.answers);
    }
  }, [questionData]);

  async function handleSubmit (e) {
    e.preventDefault();
    const filteredOptions = options.filter((option) => option !== '');
    const filteredAnswers = answers.filter((answer) => answer !== '');
    // Update the question data with the new values
    const updatedQuestionData = {
      ...questionData,
      type,
      description,
      time: Number(time),
      points: Number(points),
      url,
      options: filteredOptions,
      answers: filteredAnswers,
    };
    // Send the updated data to the backend

    const originalDataResponse = await fetch(`http://localhost:5005/admin/quiz/${params.quizId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    const originalData = await originalDataResponse.json();
    const questionIndex = originalData.questions.findIndex((question) => question.id === Number(params.questionId));
    // Update the original data with the updated question data
    const updatedQuestions = [
      ...originalData.questions.slice(0, questionIndex),
      updatedQuestionData,
      ...originalData.questions.slice(questionIndex + 1)
    ];
    const updatedData = {
      name: originalData.name,
      thumbnail: originalData.thumbnail,
      questions: updatedQuestions,
    };

    // Send the updated data to the backend
    const updateResponse = await fetch(`http://localhost:5005/admin/quiz/${params.quizId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });
    if (updateResponse.ok) {
      navigate(`/editgame/${params.quizId}`);
    } else {
      setErrorMessage('Opps, unexpected error when submitting edited information!')
    }
  }

  return (
    <>
    {errorMessage && (
  <ErrorPopup
    message={errorMessage}
    onClose={() => setErrorMessage('')}
  />
    )}
    <form onSubmit={handleSubmit}>
    <div>
      <FormControl>
        <InputLabel>Type</InputLabel>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <MenuItem value="single">Single</MenuItem>
          <MenuItem value="multiple">Multiple</MenuItem>
        </Select>
      </FormControl>
    </div>
    <div>
  <InputLabel>Description:</InputLabel>
  <TextField value={description} onChange={(e) => setDescription(e.target.value)} />
</div>
<div>
  <InputLabel>Time:</InputLabel>
  <TextField value={time} onChange={(e) => setTime(e.target.value)} />
</div>
<div>
  <InputLabel>Points:</InputLabel>
  <TextField value={points} onChange={(e) => setPoints(e.target.value)} />
</div>
<div>
  <InputLabel>Enforce video:</InputLabel>
  <TextField value={url} onChange={(e) => setUrl(e.target.value)} />
</div>
  <div>
      <label>Options:</label>
      {options.map((option, index) => (
        <div key={index}>
          <TextField
            label={`Option ${index + 1}`}
            value={option}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index] = e.target.value;
              setOptions(newOptions);
            }}
          />
        </div>
      ))}
      <Button onClick={() => { if (options.length >= 6) { setErrorMessage('At most 6 options!') } else { setOptions([...options, '']) } }}>Add option</Button>
    </div>

    <div>
      <label>Answers:</label>
      {answers.map((answer, index) => (
        <div key={index}>
          <TextField
            label={`Answer ${index + 1}`}
            value={answer}
            onChange={(e) => {
              const newAnswers = [...answers];
              newAnswers[index] = e.target.value;
              setAnswers(newAnswers);
            }}
          />
        </div>
      ))}
      <Button onClick={() => {
        if (type === 'single') {
          if (answers.length >= 1) { setErrorMessage('single choice should be only one correct answer') } else {
            setAnswers([...answers, ''])
          }
        } else if (type === 'multiple') {
          if (answers.length >= options.length) {
            setErrorMessage('the number of correct answers than options')
          } else {
            setAnswers([...answers, ''])
          }
        }
      }}>Add answer</Button>
    </div>

    <Button type="submit" variant="contained" color="primary">
      Save
    </Button>
</form>
    </>
  )
}

export default EditQuestion;
