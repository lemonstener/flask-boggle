from flask import Flask, request, render_template, jsonify, session
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = 'boggle'


boggle_game = Boggle()


@app.route('/')
def home():
    '''Display the page'''
    board = boggle_game.make_board()
    session['board'] = board
    highscore = session.get('highscore', 0)
    games_played = session.get('games_played', 0)
    return render_template('index.html', board=board, highscore=highscore, played=games_played)


@app.route('/check-word')
def check_word():
    '''Check the word provided against the word dictionary and return a result'''
    word = request.args["word"]
    board = session["board"]
    response = boggle_game.check_valid_word(board, word)
    return jsonify({'result': response})


@app.route('/endgame', methods=['POST'])
def endgame():
    '''End the game and update the statistics as needed'''
    score = request.json['score']
    highscore = session.get('highscore', 0)
    games_played = session.get('games_played', 0)
    session['games_played'] = games_played + 1
    session['highscore'] = max(highscore, score)
    return jsonify(brokeRecord=score > highscore)
