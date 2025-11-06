export interface Quiz {
  formula: string;
  answer: number;
}

export function generateQuiz(): Quiz {
  const types = [
    'simple',
    'multiplication',
    'mixed',
    'complex'
  ];
  
  const type = types[Math.floor(Math.random() * types.length)];
  
  switch (type) {
    case 'simple':
      return generateSimple();
    case 'multiplication':
      return generateMultiplication();
    case 'mixed':
      return generateMixed();
    case 'complex':
      return generateComplex();
    default:
      return generateSimple();
  }
}

function generateSimple(): Quiz {
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  const answer = a + b;
  
  return {
    formula: `${a} + ${b} = 🍌`,
    answer
  };
}

function generateMultiplication(): Quiz {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const answer = a * b;
  
  return {
    formula: `${a} × ${b} = 🍌`,
    answer
  };
}

function generateMixed(): Quiz {
  const a = Math.floor(Math.random() * 15) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const c = Math.floor(Math.random() * 5) + 1;
  const answer = a + b * c;
  
  return {
    formula: `${a} + ${b} × ${c} = 🍌`,
    answer
  };
}

function generateComplex(): Quiz {
  const patterns = [
    () => {
      // 🍌 + 5 = 12
      const answer = Math.floor(Math.random() * 20) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      const result = answer + b;
      return {
        formula: `🍌 + ${b} = ${result}`,
        answer
      };
    },
    () => {
      // 20 - 🍌 = 8
      const total = Math.floor(Math.random() * 20) + 10;
      const answer = Math.floor(Math.random() * 10) + 1;
      const result = total - answer;
      return {
        formula: `${total} - 🍌 = ${result}`,
        answer
      };
    },
    () => {
      // 3 × 🍌 = 15
      const multiplier = Math.floor(Math.random() * 5) + 2;
      const answer = Math.floor(Math.random() * 10) + 1;
      const result = multiplier * answer;
      return {
        formula: `${multiplier} × 🍌 = ${result}`,
        answer
      };
    },
    () => {
      // 🍌 - 7 + 3 = 10
      const answer = Math.floor(Math.random() * 20) + 5;
      const b = Math.floor(Math.random() * 5) + 1;
      const c = Math.floor(Math.random() * 5) + 1;
      const result = answer - b + c;
      return {
        formula: `🍌 - ${b} + ${c} = ${result}`,
        answer
      };
    },
    () => {
      // 2 × 🍌 + 5 = 15
      const multiplier = Math.floor(Math.random() * 3) + 2;
      const answer = Math.floor(Math.random() * 8) + 1;
      const addend = Math.floor(Math.random() * 5) + 1;
      const result = multiplier * answer + addend;
      return {
        formula: `${multiplier} × 🍌 + ${addend} = ${result}`,
        answer
      };
    }
  ];
  
  const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
  return selectedPattern();
}
