import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oipddooxopeduomudpuq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pcGRkb294b3BlZHVvbXVkcHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MzkxNzIsImV4cCI6MjA3MzExNTE3Mn0.vblvuc9TknrzknYMvDCUbch9hGkjQ-myy_J5hkO5TVo';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .order('set_id', { ascending: true });

    if (error) {
      throw error;
    }

    // Group questions by set_id
    const sets = {};
    questions.forEach(q => {
      if (!sets[q.set_id]) {
        sets[q.set_id] = [];
      }
      sets[q.set_id].push({
        question: q.question,
        options: JSON.parse(q.options),
        correct: q.correct_index
      });
    });

    const questionSets = Object.values(sets);

    // Shuffle sets and questions within each set
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    const shuffledSets = shuffleArray([...questionSets]);
    shuffledSets.forEach(set => shuffleArray(set));

    res.status(200).json(shuffledSets);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
}