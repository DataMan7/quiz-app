import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('API called: Env vars - URL present:', !!process.env.SUPABASE_URL, 'Key present:', !!process.env.SUPABASE_ANON_KEY);

  try {
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .order('set_id', { ascending: true });

    console.log('Supabase query result: Questions count:', questions ? questions.length : 0, 'Error:', error ? error.message : null);

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

    console.log('Processed sets count:', shuffledSets.length, 'Sample set size:', shuffledSets[0]?.length);
    res.status(200).json(shuffledSets);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions', details: error.message });
  }
}