-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
    id SERIAL PRIMARY KEY,
    set_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_index INTEGER NOT NULL
);

-- Clear existing questions to avoid duplicates (optional: comment out if you want to keep old ones)
DELETE FROM public.questions;

-- African-themed questions: 100 questions across 20 sets of 5, focusing on African context and stories
-- All apostrophes in question strings escaped as '' for Postgres SQL
-- Set 1: African History - Independence and Leaders
INSERT INTO public.questions (set_id, question, options, correct_index) VALUES
(1, 'Who led Kenya to independence in 1963?', '["Jomo Kenyatta", "Nelson Mandela", "Kwame Nkrumah", "Julius Nyerere"]'::jsonb, 0),
(1, 'In what year did South Africa end apartheid?', '["1990", "1994", "1985", "2000"]'::jsonb, 1),
(1, 'Who was the first president of Ghana?', '["Kwame Nkrumah", "Haile Selassie", "Idi Amin", "Mobutu Sese Seko"]'::jsonb, 0),
(1, 'What event is known as the "Year of Africa" for many independences?', '["1950", "1960", "1970", "1980"]'::jsonb, 1),
(1, 'Who founded the Pan-African Congress?', '["Robert Sobukwe", "Steve Biko", "Walter Sisulu", "Albert Luthuli"]'::jsonb, 0);

-- Set 2: African Geography - Rivers and Lakes
INSERT INTO public.questions (set_id, question, options, correct_index) VALUES
(2, 'Which African river is the longest in the world?', '["Amazon", "Nile", "Congo", "Zambezi"]'::jsonb, 1),
(2, 'What is the largest lake in Africa by area?', '["Lake Malawi", "Lake Tanganyika", "Lake Victoria", "Lake Chad"]'::jsonb, 2),
(2, 'Which desert covers much of North Africa?', '["Gobi", "Sahara", "Kalahari", "Namib"]'::jsonb, 1),
(2, 'Mount Kilimanjaro is located in which country?', '["Kenya", "Tanzania", "Uganda", "Ethiopia"]'::jsonb, 1),
(2, 'The Congo Basin is primarily in which region?', '["East Africa", "Central Africa", "Southern Africa", "North Africa"]'::jsonb, 1);

-- Set 3: African Science and Inventions
INSERT INTO public.questions (set_id, question, options, correct_index) VALUES
(3, 'Who is known as the father of African surgery?', '["Wangari Maathai", "Philip Emeagwali", "Magdalene A. N. A. Williams", "Beth Brown"]'::jsonb, 2),
(3, 'What African invention is the "talking drum" used for?', '["Music only", "Communication like Morse code", "Farming tool", "Weapon"]'::jsonb, 1),
(3, 'Which Kenyan won the Nobel for environmental work?', '["Wangari Maathai", "Kofi Annan", "Ellen Johnson Sirleaf", "Desmond Tutu"]'::jsonb, 0),
(3, 'The supercomputer "Connection Machine" was contributed to by which Nigerian?', '["Philip Emeagwali", "Bart Nnaji", "Philip S. Emeagwali", "Charles O. Holliday"]'::jsonb, 0),
(3, 'What African plant is used in malaria treatment?', '["Neem", "Artemisia annua", "Aloe vera", "Moringa"]'::jsonb, 1);

-- Set 4: African Literature
INSERT INTO public.questions (set_id, question, options, correct_index) VALUES
(4, 'Who wrote "Things Fall Apart"?', '["Chinua Achebe", "Ngugi wa Thiong''o", "Wole Soyinka", "Bessie Head"]'::jsonb, 0),
(4, 'What is the main theme of "Petals of Blood" by Ngugi?', '["Colonialism", "Post-colonial Kenya", "Love story", "War"]'::jsonb, 1),
(4, 'Which Nigerian won the Nobel Prize for Literature?', '["Wole Soyinka", "Chinua Achebe", "Ben Okri", "Ama Ata Aidoo"]'::jsonb, 0),
(4, ' "Half of a Yellow Sun" is set during which event?', '["Biafran War", "Apartheid", "Mau Mau Uprising", "Slave trade"]'::jsonb, 0),
(4, 'Who is the author of "Nervous Conditions"?', '["Tsitsi Dangarembga", "Nadine Gordimer", "Doris Lessing", "J.M. Coetzee"]'::jsonb, 0);

-- Set 5: African Sports
INSERT INTO public.questions (set_id, question, options, correct_index) VALUES
(5, 'Who is Kenya''s legendary long-distance runner?', '["Eliud Kipchoge", "David Rudisha", "Wilson Kipketer", "Paul Tergat"]'::jsonb, 0),
(5, 'Which African country won the FIFA World Cup?', '["Nigeria", "Cameroon", "None", "Egypt"]'::jsonb, 2),
(5, 'Who is the South African rugby captain known for Springboks?', '["Siya Kolisi", "Bryan Habana", "François Pienaar", "Cheetahs"]'::jsonb, 0),
(5, 'In which sport is Haile Gebrselassie famous?', '["Marathon running", "Boxing", "Cricket", "Swimming"]'::jsonb, 0),
(5, 'Africa Cup of Nations is won most by which country?', '["Egypt", "Cameroon", "Ghana", "Nigeria"]'::jsonb, 0);

-- Set 6: African Movies and Film
INSERT INTO public.questions (set_id, question, options, correct_index) VALUES
(6, 'Who directed "Black Panther" with African influences?', '["Ryan Coogler", "Ava DuVernay", "Jordan Peele", "Spike Lee"]'::jsonb, 0),
(6, 'What is the famous Nollywood film industry in?', '["Lagos, Nigeria", "Johannesburg, South Africa", "Nairobi, Kenya", "Cairo, Egypt"]'::jsonb, 0),
(6, 'Which film won Oscar for Best International Feature from South Africa?', '["Tsotsi", "District 9", "Invictus", "Blood Diamond"]'::jsonb, 0),
(6, ' "Queen of Katwe" is based on a Ugandan chess player''s story.', '["True", "False", "Partly true", "No"]'::jsonb, 0),
(6, 'Who is the Egyptian actor in "The Message"?', '["Omar Sharif", "Adel Emam", "Ahmed Zaki", "Nour El-Sherif"]'::jsonb, 0);

-- Set 7: African Riddles and Folklore
INSERT INTO public.questions (set_id, question, options, correct_index) VALUES
(7, 'In Anansi stories, who is the spider trickster?', '["Anansi", "Brer Rabbit", "Coyote", "Fox"]'::jsonb, 0),
(7, 'What African riddle: "I have cities but no houses" (from folklore)?', '["Map", "Story", "Dream", "River"]'::jsonb, 0),
(7, 'In Zulu folklore, who is the sky god?', '["Unkulunkulu", "Nyame", "Amma", "Olorun"]'::jsonb, 0),
(7, 'What Yoruba riddle: "White inside, black outside"?', '["Coconut", "Egg", "Book", "Drum"]'::jsonb, 0),
(7, 'Anansi stole what from the sky god in Akan tales?', '["All stories", "Wisdom", "Fire", "Water"]'::jsonb, 0);

-- Set 8: African Math and Numbers
INSERT INTO public.questions (set_id, question, options, correct_index) VALUES
(8, 'What ancient African civilization used base-10 math?', '["Egyptians", "Maya", "Greeks", "Romans"]'::jsonb, 0),
(8, 'The Ishango bone from Congo shows early what?', '["Counting", "Calendar", "Geometry", "Astronomy"]'::jsonb, 0),
(8, 'What is 15% of 200 in African trade math context?', '["30", "25", "40", "20"]'::jsonb, 0),
(8, 'Fibonacci sequence influenced by which African mathematician?', '["Al-Khwarizmi", "Ibn al-Haytham", "Omar Khayyam", "None"]'::jsonb, 3),
(8, 'How many sides does a traditional African adinkra symbol have?', '["4", "6", "8", "Varies"]'::jsonb, 3);

-- Set 9: African Geography - Countries and Capitals
INSERT INTO public.questions (set_id, question, options, correct_index) VALUES
(9, 'What is the capital of Ethiopia?', '["Nairobi", "Addis Ababa", "Mogadishu", "Khartoum"]'::jsonb, 1),
(9, 'Which country is shaped like a horn?', '["Somalia", "Libya", "Algeria", "Sudan"]'::jsonb, 0),
(9, 'The Sahel region spans which countries?', '["West Africa", "East Africa", "Southern Africa", "North Africa"]'::jsonb, 0),
(9, 'What is the largest country by area in Africa?', '["Nigeria", "Algeria", "DR Congo", "Sudan"]'::jsonb, 1),
(9, 'Victoria Falls is between which countries?', '["Zambia and Zimbabwe", "South Africa and Botswana", "Tanzania and Kenya", "Egypt and Sudan"]'::jsonb, 0);

-- Set 10: African History - Ancient Civilizations
INSERT INTO public.questions (set_id, question, options, correct_index) VALUES
(10, 'What is the ancient name for Egypt?', '["Kemet", "Nubia", "Axum", "Carthage"]'::jsonb, 0),
(10, 'The Kingdom of Kush was located in?', '["Sudan", "Ethiopia", "Ghana", "Mali"]'::jsonb, 0),
(10, 'Who was the famous queen of Egypt?', '["Nefertiti", "Hatshepsut", "Cleopatra", "All"]'::jsonb, 3),
(10, 'Great Zimbabwe is known for what?', '["Stone ruins", "Pyramids", "Gold mines", "Slave trade"]'::jsonb, 0),
(10, 'The Axum Empire was in modern-day?', '["Ethiopia", "Somalia", "Kenya", "Tanzania"]'::jsonb, 0);

-- Set 11: African Sports - Football and Olympics
INSERT INTO public.questions (set_id, question, options, correct_index) VALUES
(11, 'Who is the Egyptian "King of Football"?', '["Mohamed Salah", "Samuel Eto''o", "Didier Drogba", "George Weah"]'::jsonb, 0),
(11, 'Which African won Olympic 100m gold?', '["Usain Bolt", "Wilma Rudolph", "Jesse Owens", "None African"]'::jsonb, 3),
(11, 'CAF Champions League is for which sport?', '["Football", "Basketball", "Athletics", "Rugby"]'::jsonb, 0),
(11, 'Who is the Kenyan marathon legend?', '["Eliud Kipchoge", "Kenenisa Bekele", "Paul Tergat", "All"]'::jsonb, 3),
(11, 'African Cup of Nations started in?', '["1957", "1960", "1968", "1974"]'::jsonb, 0);

-- Set 12: African Movies - Nollywood and Beyond
INSERT INTO public.questions (set_id, question, options, correct_index) VALUES
(12, 'What is the capital of Nollywood?', '["Lagos", "Accra", "Johannesburg", "Nairobi"]'::jsonb, 0),
(12, 'Who directed "The Wedding Party"?', '["Kunle Afolayan", "Funke Akindele", "Genevieve Nnaji", "Kemi Adetiba"]'::jsonb, 3),
(12, ' "Sarafina!" is about which struggle?', '["Apartheid", "Independence", "Slavery", "Colonialism"]'::jsonb, 0),
(12, 'Which South African film is about miners?', '["Mine Boys", "Tsotsi", "District 9", "Chopper"]'::jsonb, 0),
(12, ' "Lion King" inspired by which African?', '["Hamlet", "Egyptian myth", "Hausa folklore", "Zulu stories"]'::jsonb, 3);

-- Set 13: African Riddles - Folklore Edition
INSERT INTO public.questions (set_id, question, options, correct_index) VALUES
(13, 'In Ashanti tales, Anansi wants what?', '["Stories", "Honey", "Clothes", "Food"]'::jsonb, 0),
(13, 'What Swahili riddle: "I speak but have no mouth" (echo in folklore)?', '["Wind", "River", "Echo", "Drum"]'::jsonb, 2),
(13, 'In Maasai lore, what is Enkai?', '["God", "Lion", "River", "Tree"]'::jsonb, 0),
(13, 'African riddle: "Black bird with white eggs" (cow)?', '["Chicken", "Cow", "Ostrich", "Guinea fowl"]'::jsonb, 1),
(13, 'What is the moral of many Anansi stories?', '["Cleverness wins", "Strength wins", "Honesty wins", "Luck wins"]'::jsonb, 0);

-- Set 14: African Math - History and Concepts
INSERT INTO public.questions (set_id, question, options, correct_index) VALUES
(14, 'Who is the "father of African mathematics"?', '["Hypatia", "Diophantus", "Africanus Horton", "None"]'::jsonb, 2),
(14, 'The fractals in African architecture are from?', '["Egypt", "Mali", "Ethiopia", "All"]'::jsonb, 3),
(14, 'What is the sum of first 10 natural numbers in ancient African method?', '["55", "50", "45", "60"]'::jsonb, 0),
(14, 'Lebombo bone from Swaziland shows?', '["Lunar calendar", "Counting", "Geometry", "Astronomy"]'::jsonb, 0),
(14, 'African binary system in?', '["Yoruba Ifa divination", "Egyptian hieroglyphs", "Nubian numerals", "All"]'::jsonb, 0);

-- Set 15: African Geography - Mountains and Deserts
INSERT INTO public.questions (set_id, question, options, correct_index) VALUES
(15, 'Highest mountain in Africa?', '["Kilimanjaro", "Ras Dashen", "Mount Kenya", "Drakensberg"]'::jsonb, 0),
(15, 'Kalahari Desert is in?', '["Southern Africa", "North Africa", "East Africa", "West Africa"]'::jsonb, 0),
(15, 'Okavango Delta is in which country?', '["Botswana", "Namibia", "Zambia", "Angola"]'::jsonb, 0),
(15, 'Atlas Mountains span?', '["Morocco to Tunisia", "Algeria only", "Libya", "Egypt"]'::jsonb, 0),
(15, 'Serengeti is famous for?', '["Migration", "Pyramids", "Gold", "Diamonds"]'::jsonb, 0);

-- Set 16: African History - Empires and Kingdoms
INSERT INTO public.questions (set_id, question, options, correct_index) VALUES
(16, 'Mansa Musa was emperor of?', '["Mali Empire", "Songhai", "Ghana", "Kanem-Bornu"]'::jsonb, 0),
(16, 'The Zulu Kingdom was led by?', '["Shaka Zulu", "Cetshwayo", "Dingane", "Mpande"]'::jsonb, 0),
(16, 'Benin Kingdom known for?', '["Bronze art", "Pyramids", "Mummies", "Temples"]'::jsonb, 0),
(16, 'Swahili city-states traded with?', '["Arabs and Indians", "Europeans", "Americans", "Asians only"]'::jsonb, 0),
(16, 'Great Mosque of Djenne is in?', '["Mali", "Niger", "Burkina Faso", "Senegal"]'::jsonb, 0);

-- Set 17: African Literature - Authors and Works
INSERT INTO public.questions (set_id, question, options, correct_index) VALUES
(17, 'Who wrote "Weep Not, Child"?', '["Ngugi wa Thiong''o", "Chinua Achebe", "Ama Ata Aidoo", "Niyi Osundare"]'::jsonb, 0),
(17, ' "The Beautyful Ones Are Not Yet Born" by?', '["Ayi Kwei Armah", "Kofi Awoonor", "J.P. Clark", "Gabriel Okara"]'::jsonb, 0),
(17, 'South African "Cry, the Beloved Country" author?', '["Alan Paton", "Nadine Gordimer", "Andre Brink", "J.M. Coetzee"]'::jsonb, 0),
(17, ' "So Long a Letter" is from?', '["Senegal", "Ivory Coast", "Mali", "Guinea"]'::jsonb, 0),
(17, 'Who is the "Sage of Kisumu" in literature?', '["Ngugi wa Thiong''o", "Okot p''Bitek", "Taban lo Liyong", "Richard Wright"]'::jsonb, 0);

-- Set 18: African Sports - Athletics and More
INSERT INTO public.questions (set_id, question, options, correct_index) VALUES
(18, 'Who is the Ethiopian "Flying Ethiopian"?', '["Kenenisa Bekele", "Haile Gebrselassie", "Derartu Tulu", "Tirunesh Dibaba"]'::jsonb, 1),
(18, 'African wrestler from Senegal?', '["Lamine Diack", "Fatou Bintou Fall", "Ismael Lô", "None"]'::jsonb, 1),
(18, 'Which country hosts the East African Safari Rally?', '["Kenya", "Tanzania", "Uganda", "Rwanda"]'::jsonb, 0),
(18, 'Boxing legend from Ghana?', '["Azumah Nelson", "Joshua Clottey", "Isaac Dogboe", "All"]'::jsonb, 3),
(18, 'African basketball star in NBA?', '["Hakeem Olajuwon", "Manute Bol", "Dikembe Mutombo", "All"]'::jsonb, 3);

-- Set 19: African Movies - Festivals and Directors
INSERT INTO public.questions (set_id, question, options, correct_index) VALUES
(19, 'FESPACO film festival is in?', '["Burkina Faso", "Senegal", "Mali", "Niger"]'::jsonb, 0),
(19, 'Director of "Hyenas" from Senegal?', '["Djibril Diop Mambéty", "Ousmane Sembène", "Mahama Johnson Traoré", "Sami Bouajila"]'::jsonb, 1),
(19, ' "Kirikou and the Sorceress" is animated from?', '["West Africa", "East Africa", "South Africa", "North Africa"]'::jsonb, 0),
(19, 'South African "Tsotsi" won Oscar in?', '["2005", "2000", "2010", "1995"]'::jsonb, 0),
(19, 'Who is the "father of African cinema"?', '["Ousmane Sembène", "Souleymane Cissé", "Idrissa Ouédraogo", "Gaston Kaboré"]'::jsonb, 0);

-- Set 20: African Riddles - Nature and Wisdom
INSERT INTO public.questions (set_id, question, options, correct_index) VALUES
(20, 'African riddle: "I have no legs but I can run" (river)?', '["River", "Wind", "Cloud", "Fire"]'::jsonb, 0),
(20, 'In Dogon lore, what is Amma?', '["Creator god", "Trickster", "Hero", "Ancestor"]'::jsonb, 0),
(20, 'What Hausa riddle: "One eye, one leg, carries a load" (needle)?', '["Needle", "Stick", "Arrow", "Spear"]'::jsonb, 0),
(20, 'African proverb origin: "It takes a village to raise a child"?', '["Igbo", "Swahili", "Zulu", "Yoruba"]'::jsonb, 0),
(20, 'What is the "talking drum" in Yoruba culture?', '["Communication tool", "Music instrument only", "Weapon", "Food"]'::jsonb, 0);

-- Enable RLS for public read access
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access" ON public.questions;
CREATE POLICY "Public read access" ON public.questions FOR SELECT USING (true);
