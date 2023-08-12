import React, { useEffect, useState } from 'react';
import './App.css';

type Statuses = 'GREEN' | 'YELLOW' | 'BLACK' | 'UNKNOWN';
type Letter = {
  text: string;
  status: Statuses;
};

const initialLetter: Letter = { text: '', status: 'UNKNOWN' };

// sorry, I don't have enough time for clean my final code. usually I don't use a lot of functions in a component.

function App() {
  const [activeColumn, setActiveColumn] = useState(0);
  const [activeRow, setActiveRow] = useState(0);
  const [letters, setLetters] = useState<Array<Array<Letter>>>([]);
  const [checkedLetters, setCheckLetters] = useState({
    greenLetters: '',
    yellowLetters: '',
    blackLetters: '',
  });
  const [gameStatus, setGameStatus] = useState<'You Win!' | 'You Lose' | ''>(
    ''
  );

  const word = 'YOUNG';

  useEffect(() => {
    const temp = Array(5).fill(Array(5).fill(initialLetter));
    setLetters(temp);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [letters]);

  useEffect(() => {
    if (activeRow > 0) {
      const letterNotGreen = letters[activeRow - 1].find(
        (letter) => letter.status !== 'GREEN'
      );
      if (letterNotGreen === undefined) {
        setGameStatus('You Win!');
        document.removeEventListener('keydown', handleKeyDown);
      } else if (activeRow > 4) {
        setGameStatus('You Lose');
        document.removeEventListener('keydown', handleKeyDown);
      }
    }
  }, [activeRow]);

  const handleKeyDown = (key: string | KeyboardEvent) => {
    if (key instanceof KeyboardEvent) {
      key = key.key;
    }
    if (key === 'Enter') {
      if (activeColumn === 5) {
        const temp = letters;
        const tempChecked = checkedLetters;
        temp[activeRow] = [
          ...temp[activeRow].map((letter, index): Letter => {
            if (word[index] === letter.text) {
              tempChecked.greenLetters = tempChecked.greenLetters + letter.text;
              return { text: letter.text, status: 'GREEN' };
            } else if (word.includes(letter.text)) {
              tempChecked.yellowLetters =
                tempChecked.yellowLetters + letter.text;
              return { text: letter.text, status: 'YELLOW' };
            }
            tempChecked.blackLetters = tempChecked.blackLetters + letter.text;
            return { text: letter.text, status: 'BLACK' };
          }),
        ];
        setLetters([...temp]);
        setCheckLetters({ ...tempChecked });
        setActiveRow(activeRow + 1);
        setActiveColumn(0);
      }
    } else if (key === 'Backspace') {
      if (activeColumn > 0) {
        changeLetterState(initialLetter, activeRow, activeColumn - 1);
        setActiveColumn(activeColumn - 1);
      }
    } else if (/^[a-zA-Z]$/.test(key) && activeColumn < 5) {
      changeLetterState(
        {
          text: key.toUpperCase(),
          status: 'UNKNOWN',
        },
        activeRow,
        activeColumn
      );
      setActiveColumn(activeColumn + 1);
    }
  };

  const changeLetterState = (
    letterState: Letter,
    row: number,
    column: number
  ) => {
    const temp = [...letters];
    const tempRow = [...temp[row]];
    tempRow[column] = letterState;
    temp[row] = [...tempRow];
    setLetters([...temp]);
  };

  const resetGame = () => {
    setActiveColumn(0);
    setActiveRow(0);
    setGameStatus('');
    setCheckLetters({ greenLetters: '', blackLetters: '', yellowLetters: '' });
    const temp = Array(5).fill(Array(5).fill(initialLetter));
    setLetters(temp);
  };

  const renderBackgroundColor = (
    status: Statuses,
    isInKeyBoardButton?: boolean
  ) => {
    switch (status) {
      case 'GREEN':
        return '#538d4e';
      case 'YELLOW':
        return '#b59f3b';
      case 'BLACK':
        return '#3a3a3c';
      default:
        return isInKeyBoardButton ? '#818384' : 'transparent';
    }
  };

  const RenderKey = ({ letter }: { letter: string }) => {
    let status: Statuses = 'UNKNOWN';
    if (letter.length === 1)
      if (checkedLetters.greenLetters.includes(letter)) {
        status = 'GREEN';
      } else if (checkedLetters.yellowLetters.includes(letter)) {
        status = 'YELLOW';
      } else if (checkedLetters.blackLetters.includes(letter)) {
        status = 'BLACK';
      }

    return (
      <button
        className="h-[58px] flex items-center justify-center text-xl font-bold rounded-[4px] px-3.5"
        onClick={gameStatus === '' ? () => handleKeyDown(letter) : () => {}}
        style={{ backgroundColor: renderBackgroundColor(status, true) }}
      >
        {letter}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center bg-black pt-[100px] pb-10 h-screen">
      <p className="text-2xl font-bold mb-10">{gameStatus}</p>
      {letters.length > 0 &&
        letters.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2 mt-2 first:mt-0">
            {row.map((letter, columnIndex) => (
              <div
                key={columnIndex}
                className="w-[62px] h-[62px] flex items-center justify-center text-[32px] font-bold border-2 border-[#3a3a3c]"
                style={{
                  backgroundColor: renderBackgroundColor(letter.status),
                }}
              >
                {letters[rowIndex][columnIndex].text}
              </div>
            ))}
          </div>
        ))}
      <div className="flex flex-col items-center gap-2 mt-[100px]">
        <div className="flex gap-2">
          {'QWERTYUIOP'.split('').map((item, index) => (
            <RenderKey key={item} letter={item} />
          ))}
        </div>
        <div className="flex gap-2">
          {'ASDFGHJKL'.split('').map((item, index) => (
            <RenderKey key={item} letter={item} />
          ))}
        </div>
        <div className="flex gap-2">
          <RenderKey letter={'Enter'} />
          {'ASDFGHJKL'.split('').map((item, index) => (
            <RenderKey key={item} letter={item} />
          ))}
          <RenderKey letter={'Backspace'} />
        </div>
      </div>
      <button className="text-2xl font-bold mt-10" onClick={resetGame}>
        Reset
      </button>
    </div>
  );
}

export default App;
