import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import JoinSession from './JoinSession';
import CountdownTimer from './CountdownTimer';
import {
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Container,
  Grid,
} from '@mui/material';

function ViewGames ({ token }) {
  const [playerName, setPlayerName] = React.useState('');
  const [isJoined, setIsJoined] = React.useState(false);
  const [questionData, setQuestionData] = React.useState([]);
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [nextQuestion, setNextQuestion] = React.useState(false);
  const params = useParams();

  async function fetchQuestionData () {
    const response = await fetch(`http://localhost:5005/admin/session/${params.sessionId}/status`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json ',
        Authorization: `Bearer ${token}`,
      }
    })

    const data = await response.json();
    console.log(data)
    setQuestionData(data.results.questions);
    setNextQuestion(!nextQuestion);
  }

  const handleJoin = (name) => {
    setPlayerName(name);
    setIsJoined(true);
    fetchQuestionData(); // Call fetchQuestionData() here
  };

  useEffect(() => {
    fetchQuestionData()
  }, []);

  function pollNextQuestion () {
    setQuestionIndex((index) => index + 1);
  }

  const renderURLContent = (url) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const videoExtensions = ['.mp4', '.webm', '.ogg'];

    const extension = url.slice(url.lastIndexOf('.')).toLowerCase();

    if (imageExtensions.includes(extension)) {
      return <img src={url} alt="content" />;
    } else if (videoExtensions.includes(extension)) {
      return (
        <video width="320" height="240" controls>
          <source src={url} type={`video/${extension.slice(1)}`} />
          Your browser does not support the video tag.
        </video>
      );
    }
  };

  return (
    <Container maxWidth="md">
      {!isJoined && <JoinSession onJoin={handleJoin} />}
      {isJoined && <Typography variant="h5">Welcome, {playerName}!</Typography>}
      {questionIndex < questionData.length
        ? (
        <Card>
          <CardContent>
            <Typography variant="h6">Question {questionIndex + 1}</Typography>
            <Typography>Type: {questionData[questionIndex].type}</Typography>
            <Typography>Description: {questionData[questionIndex].description}</Typography>
            <Typography>Enfore: {renderURLContent(questionData[questionIndex].url)}</Typography>
            <Grid container spacing={2}>
              {questionData[questionIndex].options.map((option, index) => (
                <Grid item key={index}>
                  <Button variant="outlined">{option}</Button>
                </Grid>
              ))}
            </Grid>
          </CardContent>
          <CardActions>
            <Button variant="contained" color="primary" onClick={pollNextQuestion}>
              Next
            </Button>
          </CardActions>
          <CountdownTimer time={questionData[questionIndex].time} onNext={pollNextQuestion} />
        </Card>
          )
        : (
        <>
          {isJoined && (
            <div>
              <Typography variant="h4">Quiz Finished!</Typography>
              <Typography>Thank you for participating.</Typography>
              {/* Add any additional content or actions for the finish page here */}
            </div>
          )}
        </>
          )}
    </Container>
  );
}

export default ViewGames;
