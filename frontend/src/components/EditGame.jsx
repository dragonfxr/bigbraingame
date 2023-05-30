import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LogOut from './Logout';
import ErrorPopup from './ErrorPopup';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import { Link, Card, CardActions, CardContent, Typography } from '@mui/material';

function EditGame ({ token }) {
  const [questions, setQuestions] = React.useState([]);
  const [game, setGame] = React.useState('');
  const [reloadPage, setReloadPage] = React.useState(false);
  const [addQuestionDialogOpen, setAddQuestionDialogOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const navigate = useNavigate();

  // const navigate = useNavigate();
  const params = useParams();
  async function fetchAllQuestions () {
    const response = await fetch(`http://localhost:5005/admin/quiz/${params.quizId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    })
    const data = await response.json();
    setQuestions(data.questions);
    setGame(data);
    setReloadPage(false);
  }

  React.useEffect(async () => {
    await fetchAllQuestions();
  }, [reloadPage]);

  // delete button: to dele a particular question
  async function deleteQuestions (deleteId) {
    const updatedQuestions = questions.filter((question) => question.id !== deleteId);
    await fetch(`http://localhost:5005/admin/quiz/${params.quizId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...game,
        questions: updatedQuestions,
      }),
    })
    setReloadPage(!reloadPage);
    setQuestions(updatedQuestions);
  }
  const [type, setType] = React.useState('single');
  const [description, setDescription] = React.useState('');
  const [time, setTime] = React.useState(0);
  const [points, setPoints] = React.useState(0);
  const [url, setUrl] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const [answers, setAnswers] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');
  const [answerInputValue, setAnswerInputValue] = React.useState('');

  // add button: to add a question and its relative information
  async function addQuestion () {
    if (!description || !time || !points || !url || options.length < 2 || answers.length === 0) {
      setErrorMessage('Please fill in all the required fields and make sure there are at least 2 options and 1 correct answer.');
      return;
    } else if (isNaN(time) || isNaN(points)) {
      setErrorMessage('Time and points have to be intergers.');
      return;
    }

    setAddQuestionDialogOpen(false);
    setDescription('');
    setTime('');
    setPoints('');
    setUrl('');
    setType('single');
    setOptions([]);
    setAnswers([]);

    function generateRandomId () {
      return Math.floor(Math.random() * 1000000);
    }

    const newQuestion = {
      id: generateRandomId(),
      type,
      description,
      time: Number(time),
      points: Number(points),
      url,
      options,
      answers,
    };

    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);

    await fetch(`http://localhost:5005/admin/quiz/${params.quizId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...game,
        questions: updatedQuestions,
      }),
    });
  }

  // preparations for ui part
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (e.target.value && options.length <= 6) {
        setOptions([...options, e.target.value]);
        setInputValue('');
      } else if (options.length > 6) {
        setInputValue('');
        setErrorMessage('You can add a maximum of 6 options');
      }
    }
  };

  const handleAnswerKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (type === 'single' && answers.length > 0) {
        setErrorMessage('Only one correct answer is allowed for single type questions');
        return;
      }
      setAnswers([...answers, e.target.value]);
      setAnswerInputValue('');
    }
  };

  // change name button: change name of quiz
  const [editNameDialogOpen, setEditNameDialogOpen] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const handleNameChange = async () => {
    await fetch(`http://localhost:5005/admin/quiz/${params.quizId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...game,
        name: newName,
      }),
    });

    setEditNameDialogOpen(false);
    setGame({ ...game, name: newName });
  };

  // change thumbnail button: change image of thumbnail
  const [editThumbnailDialogOpen, setEditThumbnailDialogOpen] = React.useState(false);
  const [newThumbnail, setNewThumbnail] = React.useState('');

  const handleThumbnailChange = async () => {
    await fetch(`http://localhost:5005/admin/quiz/${params.quizId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...game,
        thumbnail: newThumbnail,
      }),
    });

    setEditThumbnailDialogOpen(false);
    setGame({ ...game, thumbnail: newThumbnail });
  };

  // edit button: click edit to a new route
  function navigateEditQuestion (quizId, questionId) {
    navigate(`/editgame/${quizId}/${questionId}`);
  }

  // come back to dashborad
  function navigateDashboard () {
    navigate('/dashboard');
  }
  return (
        <>
            {errorMessage && (
                <ErrorPopup
                    message={errorMessage}
                    onClose={() => setErrorMessage('')}
                />
            )}
            <Dialog open={addQuestionDialogOpen} onClose={() => setAddQuestionDialogOpen(false)}>
                <DialogTitle>Add a new question</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        label="Type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        variant="outlined"
                        fullWidth
                    >
                        <MenuItem value="single">Single</MenuItem>
                        <MenuItem value="multiple">Multiple</MenuItem>
                    </TextField>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Description"
                        fullWidth
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Time"
                        fullWidth
                        variant="outlined"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    /><TextField
                        autoFocus
                        margin="dense"
                        label="Point"
                        fullWidth
                        variant="outlined"
                        value={points}
                        onChange={(e) => setPoints(e.target.value)}
                    /><TextField
                        autoFocus
                        margin="dense"
                        label="Enforce video"
                        fullWidth
                        variant="outlined"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    /><TextField
                        autoFocus
                        margin="dense"
                        label="Options (Please press enter, if one option is determined.)"
                        fullWidth
                        variant="outlined"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    {options.map((option, index) => (
                        <Chip
                            key={index}
                            label={option}
                            onDelete={() => {
                              setOptions(options.filter((_, i) => i !== index));
                            }}
                            style={{ marginRight: '5px', marginBottom: '5px' }}
                        />
                    ))}
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Correct answer (Please press enter, if one answer is determined.)"
                        fullWidth
                        variant="outlined"
                        value={answerInputValue}
                        onChange={(e) => setAnswerInputValue(e.target.value)}
                        onKeyPress={handleAnswerKeyPress}
                    />
                    {answers.map((answer, index) => (
                        <Chip
                            key={index}
                            label={answer}
                            onDelete={() => {
                              setAnswers(answers.filter((_, i) => i !== index));
                            }}
                            style={{ marginRight: '5px', marginBottom: '5px' }}
                        />
                    ))}

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddQuestionDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={addQuestion} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            <div>
                <Typography variant="h3" gutterBottom>
                    Quiz Name: {game.name}
                </Typography>
                <Button variant="contained" color="success" size='small' onClick={() => setEditNameDialogOpen(true)}>
                    Change Name
                </Button>
                <Dialog open={editNameDialogOpen} onClose={() => setEditNameDialogOpen(false)}>
                    <DialogTitle>Change Quiz Name</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="New Quiz Name"
                            fullWidth
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditNameDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleNameChange}>Change</Button>
                    </DialogActions>
                </Dialog>
                <Typography variant="h6">
                    Thumbnail:
                    <img
                        src={game.thumbnail}
                        alt="thumbnail"
                        style={{ width: '200px', height: '50px', marginLeft: '10px' }}
                    />
                    <Button variant="contained" color="success" onClick={() => setEditThumbnailDialogOpen(true)} sx={{ borderRadius: '25px' }} >
                        Change Thumbnail
                    </Button>
                    <Dialog open={editThumbnailDialogOpen} onClose={() => setEditThumbnailDialogOpen(false)}>
                        <DialogTitle>Change Thumbnail</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="New Thumbnail URL"
                                fullWidth
                                value={newThumbnail}
                                onChange={(e) => setNewThumbnail(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setEditThumbnailDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleThumbnailChange}>Change</Button>
                        </DialogActions>
                    </Dialog>
                </Typography>
            </div>
            <div>
                <Button variant="contained" color="primary" onClick={() => setAddQuestionDialogOpen(true)}>
                    Add question
                </Button>
            </div>
            {questions.map((question, index) => (
                <Card key={index} sx={{ marginTop: 2 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Question: {index + 1}
                        </Typography>
                        <Typography variant="body1">{question.description}</Typography>
                        <Typography variant="body2">This question worths: {question.points} points.</Typography>
                        <Typography variant="body2">Time limit: {question.time} seconds.</Typography>
                        <Typography variant="body2">URL: <Link href={`https://${question.url}`}>{question.url}</Link></Typography>
                        <Typography variant="body2">Options: {question.options.join(', ')}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary" onClick={() => navigateEditQuestion(params.quizId, question.id)}>
                            Edit
                        </Button>
                        <Button size="small" color="secondary" onClick={() => deleteQuestions(question.id)}>
                            Delete
                        </Button>
                    </CardActions>
                </Card>
            ))}
            <div>
                <LogOut />
            </div>
            <div>
                <Button variant="contained" color="primary" onClick={() => navigateDashboard()}>
                    Back to dashboard
                </Button>
            </div>

        </>
  );
}

export default EditGame;
