export interface LessonStep {
  move: string;
  hint: string;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: 'opening' | 'tactics' | 'endgame' | 'strategy';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  startPosition: string;
  steps: LessonStep[];
}

export const lessons: Lesson[] = [
  {
    id: 'scholar-mate',
    title: "Scholar's Mate",
    description: "Learn the fastest checkmate - how to do it and defend against it",
    category: 'opening',
    difficulty: 'Beginner',
    startPosition: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      {
        move: 'e4',
        hint: "Start by controlling the center with a pawn move",
        explanation: "e4 opens up the diagonal for the queen and bishop"
      },
      {
        move: 'e5',
        hint: "Black responds symmetrically",
        explanation: "Black mirrors White's center control"
      },
      {
        move: 'Bc4',
        hint: "Develop your bishop to attack f7",
        explanation: "The bishop targets f7, the weakest square in Black's position"
      },
      {
        move: 'Nc6',
        hint: "Black develops a knight",
        explanation: "Natural development, but doesn't defend f7"
      },
      {
        move: 'Qf3',
        hint: "Bring out your queen to join the attack on f7",
        explanation: "The queen and bishop combine to attack f7"
      },
      {
        move: 'Nf6',
        hint: "Black develops, still not defending f7",
        explanation: "Black misses the threat!"
      },
      {
        move: 'Qxf7#',
        hint: "Capture on f7 with check!",
        explanation: "Checkmate! The queen is protected by the bishop, and the king cannot escape."
      }
    ]
  },
  {
    id: 'fork-tactic',
    title: "Knight Fork",
    description: "Master the powerful knight fork tactic to win material",
    category: 'tactics',
    difficulty: 'Beginner',
    startPosition: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    steps: [
      {
        move: 'Ng5',
        hint: "Move your knight to attack multiple pieces",
        explanation: "The knight attacks both f7 and threatens a fork"
      },
      {
        move: 'd6',
        hint: "Black tries to defend",
        explanation: "Black defends but it's not enough"
      },
      {
        move: 'Nxf7',
        hint: "Take on f7 to fork the king and rook!",
        explanation: "Knight fork! The knight attacks both the king and the rook on h8. After the king moves, you win the rook!"
      }
    ]
  },
  {
    id: 'back-rank-mate',
    title: "Back Rank Mate",
    description: "Learn how to deliver checkmate on the back rank",
    category: 'tactics',
    difficulty: 'Intermediate',
    startPosition: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
    steps: [
      {
        move: 'Re8#',
        hint: "Move your rook to the 8th rank",
        explanation: "Checkmate! The black king is trapped by its own pawns on the back rank with no escape squares."
      }
    ]
  },
  {
    id: 'pin-tactic',
    title: "The Pin",
    description: "Use pins to immobilize enemy pieces and win material",
    category: 'tactics',
    difficulty: 'Intermediate',
    startPosition: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
    steps: [
      {
        move: 'Nf6',
        hint: "Black develops the knight",
        explanation: "Black brings the knight out"
      },
      {
        move: 'Ng5',
        hint: "Attack f7 again and prepare a discovery",
        explanation: "The knight attacks f7"
      },
      {
        move: 'd6',
        hint: "Black defends f7",
        explanation: "Black tries to shore up the defense"
      },
      {
        move: 'd4',
        hint: "Open up the center and create threats",
        explanation: "Opening the position with the bishop pointing at the knight on f6, which is pinned!"
      }
    ]
  },
  {
    id: 'king-pawn-endgame',
    title: "King and Pawn Endgame",
    description: "Master the essential king and pawn endgame technique",
    category: 'endgame',
    difficulty: 'Beginner',
    startPosition: '8/8/8/3k4/8/3P4/3K4/8 w - - 0 1',
    steps: [
      {
        move: 'Kc3',
        hint: "Bring your king forward to support the pawn",
        explanation: "The king must lead the pawn forward"
      },
      {
        move: 'Ke5',
        hint: "Black's king tries to stop the pawn",
        explanation: "Black opposes the advance"
      },
      {
        move: 'd4',
        hint: "Push the pawn while it's supported",
        explanation: "The pawn advances with king support"
      },
      {
        move: 'Kd5',
        hint: "Black blocks the pawn",
        explanation: "Black tries to blockade"
      },
      {
        move: 'Kb4',
        hint: "Move your king to the side to make progress",
        explanation: "Outflanking - the key technique in pawn endgames!"
      }
    ]
  },
  {
    id: 'opposition',
    title: "The Opposition",
    description: "Learn the critical concept of opposition in king and pawn endgames",
    category: 'endgame',
    difficulty: 'Intermediate',
    startPosition: '8/8/4k3/8/8/4K3/8/8 w - - 0 1',
    steps: [
      {
        move: 'Kd4',
        hint: "Move to gain the opposition",
        explanation: "By moving to d4, you gain the opposition - the kings are directly opposed with an odd number of squares between them"
      },
      {
        move: 'Kd6',
        hint: "Black maintains opposition",
        explanation: "Black keeps the opposition"
      },
      {
        move: 'Ke4',
        hint: "Continue maneuvering",
        explanation: "Keep probing for a breakthrough"
      }
    ]
  },
  {
    id: 'control-center',
    title: "Control the Center",
    description: "Understand why controlling the center is crucial in chess",
    category: 'strategy',
    difficulty: 'Beginner',
    startPosition: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      {
        move: 'e4',
        hint: "Start by occupying the center with a pawn",
        explanation: "e4 controls the d5 and f5 squares and opens lines for your pieces"
      },
      {
        move: 'e5',
        hint: "Black does the same",
        explanation: "Fighting for central control"
      },
      {
        move: 'Nf3',
        hint: "Develop a knight toward the center",
        explanation: "The knight controls central squares and prepares for castling"
      },
      {
        move: 'Nc6',
        hint: "Black develops",
        explanation: "Both sides are developing while maintaining central presence"
      },
      {
        move: 'd4',
        hint: "Challenge the center with another pawn",
        explanation: "Challenging Black's central pawn and opening more lines"
      }
    ]
  },
  {
    id: 'development',
    title: "Piece Development",
    description: "Learn the importance of developing your pieces quickly in the opening",
    category: 'strategy',
    difficulty: 'Beginner',
    startPosition: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      {
        move: 'e4',
        hint: "Open up lines for your pieces",
        explanation: "This move opens diagonals for the bishop and queen"
      },
      {
        move: 'e5',
        hint: "Black mirrors",
        explanation: "Black does the same"
      },
      {
        move: 'Nf3',
        hint: "Develop your knight to a good square",
        explanation: "Knights before bishops - develop toward the center"
      },
      {
        move: 'Nc6',
        hint: "Black develops too",
        explanation: "Both sides developing"
      },
      {
        move: 'Bc4',
        hint: "Develop the bishop",
        explanation: "The bishop attacks f7 and prepares for castling"
      },
      {
        move: 'Bc5',
        hint: "Black develops the bishop",
        explanation: "Symmetrical development"
      },
      {
        move: 'O-O',
        hint: "Castle to safety!",
        explanation: "Castling gets the king to safety and connects the rooks. A key principle of good opening play!"
      }
    ]
  },
  {
    id: 'italian-game',
    title: "Italian Game",
    description: "Master one of the oldest and most solid chess openings",
    category: 'opening',
    difficulty: 'Intermediate',
    startPosition: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      {
        move: 'e4',
        hint: "Classical center pawn opening",
        explanation: "Strong central control"
      },
      {
        move: 'e5',
        hint: "Black responds in kind",
        explanation: "Symmetrical response"
      },
      {
        move: 'Nf3',
        hint: "Develop and attack e5",
        explanation: "Knight development with a threat"
      },
      {
        move: 'Nc6',
        hint: "Defend the pawn",
        explanation: "Protection and development"
      },
      {
        move: 'Bc4',
        hint: "The Italian bishop move",
        explanation: "This defines the Italian Game - the bishop aims at f7"
      },
      {
        move: 'Bc5',
        hint: "Black mirrors the setup",
        explanation: "The Giuoco Piano variation"
      },
      {
        move: 'c3',
        hint: "Prepare d4",
        explanation: "Supporting the central pawn break d4"
      },
      {
        move: 'Nf6',
        hint: "Black develops and attacks e4",
        explanation: "Active piece play"
      },
      {
        move: 'd4',
        hint: "Challenge the center!",
        explanation: "This central break is the key idea of the Italian Game"
      }
    ]
  },
  {
    id: 'smothered-mate',
    title: "Smothered Mate",
    description: "Learn this beautiful checkmate pattern with the knight",
    category: 'tactics',
    difficulty: 'Advanced',
    startPosition: '5rk1/5ppp/8/8/8/8/5PPP/4RNK1 w - - 0 1',
    steps: [
      {
        move: 'Nf3',
        hint: "Position your knight",
        explanation: "The knight prepares for the final blow"
      },
      {
        move: 'Kg8',
        hint: "Black's king is trapped",
        explanation: "The king has nowhere to go"
      },
      {
        move: 'Nh4',
        hint: "Move the knight closer",
        explanation: "Getting into position"
      },
      {
        move: 'Kh8',
        hint: "King is driven to the corner",
        explanation: "The trap is set"
      },
      {
        move: 'Nf7#',
        hint: "Deliver the smothered mate!",
        explanation: "Checkmate! The king is smothered by its own pieces and cannot escape the knight."
      }
    ]
  }
];


