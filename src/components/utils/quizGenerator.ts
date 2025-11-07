export interface Quiz {
  image: string;
  answer: number;
}

export async function generateQuiz(): Promise<Quiz> {
  const response = await fetch('https://marcconrad.com/uob/banana/api.php');
  const data = await response.json();
  return {
    image: data.question,
    answer: data.solution
  };
}
