import React from 'react';
import LogOut from './Logout';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

function Dashboard ({ token }) {
  const [newGameShow, setNewGameShow] = React.useState(false);
  const [quizzes, setQuizzes] = React.useState([]);
  const [newQuizName, setNewQuizName] = React.useState('');
  const [startGameDialogOpen, setStartGameDialogOpen] = React.useState(false);
  const [endGameDialogOpen, setEndGameDialogOpen] = React.useState(false);
  const [currentGameDetails, setCurrentGameDetails] = React.useState('');
  const [sessionDetails, setSessionDetails] = React.useState('');
  const [activeGameIds, setActiveGameIds] = React.useState([]);
  const navigate = useNavigate();

  async function fetchAllQuizzes () {
    const response = await fetch('http://localhost:5005/admin/quiz', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    })
    const data = await response.json();
    const quizzesWithDetails = await Promise.all(
      data.quizzes.map(async (quiz) => {
        const response = await fetch(`http://localhost:5005/admin/quiz/${quiz.id}`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const quizDetails = await response.json();
        return { id: quiz.id, details: quizDetails };
      })
    );

    setQuizzes(quizzesWithDetails);
  }

  React.useEffect(async () => {
    await fetchAllQuizzes();
  }, [newGameShow]);

  async function fetchQuiz (id) {
    const response = await fetch(`http://localhost:5005/admin/quiz/${id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const quizDetails = await response.json();
    setCurrentGameDetails(quizDetails);
  }

  async function createNewGame () {
    await fetch('http://localhost:5005/admin/quiz/new', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newQuizName,
      })
    });
    setNewGameShow(!newGameShow);
    setNewQuizName('');
  }

  function navigateEdit (quizId) {
    navigate(`/editgame/${quizId}`);
  }

  function navigateResults (sessionId) {
    navigate(`/results/${sessionId}`);
  }

  async function deleteGame (id) {
    await fetch(`http://localhost:5005/admin/quiz/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    setNewGameShow(!newGameShow);
  }
  function calcTime (quiz) {
    const totalTime = quiz.details.questions.reduce((acc, question) => acc + question.time, 0);
    // console.log(quiz);

    return totalTime;
  }
  // const [activeGame, setActiveGame] = React.useState([]);
  async function startGame (id) {
    await fetch(`http://localhost:5005/admin/quiz/${id}/start`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    setActiveGameIds((prevActiveGameIds) => [...prevActiveGameIds, id]);
  }
  async function endGame (id) {
    await fetch(`http://localhost:5005/admin/quiz/${id}/end`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    setActiveGameIds((prevActiveGameIds) =>
      prevActiveGameIds.filter((gameId) => gameId !== id)
    );
  }

  const copySessionLink = async () => {
    const sessionURL = `http://localhost:3000/play/${currentGameDetails.active}`;
    try {
      await navigator.clipboard.writeText(sessionURL);
      alert('Session link copied to clipboard');
    } catch (err) {
      alert('Failed to copy the session link');
    }
  };

  async function fetchSession (sessionid) {
    const response = await fetch(`http://localhost:5005/admin/session/${sessionid}/status`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).catch((error) => {
      console.error('Error fetching', error);
    });
    const sessionDetails = await response.json();
    setSessionDetails(sessionDetails.results);
  }

  return (
    <>
    {/* start game dialog */}
      <Dialog open={startGameDialogOpen} onClose={() => setStartGameDialogOpen(false)}>
        <DialogTitle>The game session {currentGameDetails.active} is started</DialogTitle>
        <DialogContent>
          Click Copy Link button to copy the URL and join the game!
        </DialogContent>
        <DialogActions>
          <Button onClick={copySessionLink} color="secondary">
            Copy Link✔
          </Button>
          <Button onClick={() => setStartGameDialogOpen(false)} color="primary">
              OK
          </Button>
        </DialogActions>
      </Dialog>
       {/* end game dialog */}
      <Dialog open={endGameDialogOpen} onClose={() => setEndGameDialogOpen(false)}>
        <DialogTitle>Session: {currentGameDetails.active} is ended.</DialogTitle>
        <DialogContent>
          <Typography>
            Players: {sessionDetails.players && sessionDetails.players.join(', ')}
          </Typography>
          <br />
          <Typography>
            Would you like to view results?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEndGameDialogOpen(false)} color="primary">
            OK
          </Button>
          <Button onClick={() => navigateResults(currentGameDetails.active)} color="success">
            View Results
          </Button>
        </DialogActions>
      </Dialog>
      {/* MAIN */}
      <header>
        <h1>Dashboard</h1>
        <h2>List of Games</h2>
      </header>
      <section>
        {quizzes.map((quiz) => (
          <Box key={quiz.id} sx={{ mb: 2 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  Name of quiz: {quiz.details.name}
                </Typography>
                <Typography>
                  Number of questions: {quiz.details.questions.length}
                </Typography>
                {quiz.thumbnail
                  ? (
                  <img
                    src={quiz.details.thumbnail}
                    alt="thumbnail"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      marginBottom: '1rem',
                    }}
                  />
                    )
                  : (
                  <Typography>No image available</Typography>
                    )}
                <Typography>Time to complete:{calcTime(quiz)} seconds</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigateEdit(quiz.id)}
                >
                  Edit game
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => deleteGame(quiz.id)}
                >
                  Delete Game
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  disabled={activeGameIds.includes(quiz.id)}
                  onClick={async () => {
                    await startGame(quiz.id);
                    await fetchQuiz(quiz.id);
                    setStartGameDialogOpen(true);
                  }}
                >
                  Start a new session!
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  disabled={!activeGameIds.includes(quiz.id)}
                  onClick={async () => {
                    await fetchSession(currentGameDetails.active);
                    setEndGameDialogOpen(true);
                    await endGame(quiz.id);
                  }}
                >
                  End session!
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  disabled={!activeGameIds.includes(quiz.id)}
                  onClick={async () => {
                    alert('Successfully advanced to next question!');
                  }}
                >
                  Next Question👉
                </Button>
              </CardContent>
            </Card>
          </Box>
        ))}
      </section>
      <br />
      <br />
      <br />

      <Button variant="contained" onClick={() => setNewGameShow(!newGameShow)}>
        {newGameShow ? 'Hide' : 'Show'} Create Game
      </Button>
      {newGameShow && (
        <>
          <br />
          <Typography variant="h6">From here for new game!</Typography>
          <br />
          <TextField
            label="Name"
            value={newQuizName}
            onChange={(e) => setNewQuizName(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={createNewGame}>
            Create new game
          </Button>
        </>
      )}

      <div><LogOut/></div>

    </>
  );
}

export default Dashboard;
