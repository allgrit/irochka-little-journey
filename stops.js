'use strict';
const STOPS = [
 ['Milan','4 October','duomo','A suitcase full of possibilities.','And so the adventure begins. I’m with you, even from here.'],
 ['Lake Maggiore','4 October','lake','A little island detour.','A lake, an island, a deep breath. Keep a little of this peace.','maggiore'],
 ['Lucerne','5 October','bridge','A wooden bridge into the mountains.','A bridge for your feet. A little message for your heart.'],
 ['Strasbourg','5 October','timber','Fairytale houses. Real-life sleepy feet.','If all the pretty streets begin to look alike, call your Sasha navigation.'],
 ['Paris','6–7 October','eiffel','A little leap over the City of Light.','Paris may have a thousand lights. You’re still my favourite one.'],
 ['Brussels','8 October','guild','One small hop. Maybe one large waffle.','Important navigation advice: there is always time for a little treat.'],
 ['Amsterdam','9 October','canal','Canals, little bridges, another lovely turn.','Lost count of the bridges? That’s fine. I’m keeping a hug for you.'],
 ['The Hague','9 October','palace','A little royal detour.','Even royal palaces need a cosy corner. Yours is waiting with me.','hague'],
 ['Volendam','10 October','harbour','Little houses beside the harbour.','A tiny harbour, a big world. And someone at home thinking of you.'],
 ['Zaanse Schans','10 October','mill','The windmills are doing the waving today.','The windmills say hello. Two fluffy tails at home say it even louder.'],
 ['Frankfurt','10–11 October','timber','Another skyline. One very loved traveller.','So many kilometres. Never too far for a little love from me.'],
 ['Munich','11 October','guild','Another square, another chapter.','You don’t have to remember every street. Just remember: I’m here.'],
 ['Füssen','12 October','castle','A fairytale castle in the Alps.','A castle is lovely. But home is wherever I get to hold you.'],
 ['Innsbruck','12 October','alps','Over the mountains, one gentle hop.','Even the mountains can’t get in the way of a call from you.'],
 ['Verona','13 October','arena','A city with a soft spot for love stories.','Romeo had a balcony. You have Sasha navigation. Much more practical.'],
 ['Venice','13 October','venice','You are here. Yes, really. Venice.','If you forget which city this is, don’t worry. I remember who I love.'],
 ['Padua','14 October','domes','One more beautiful stop along the way.','One more square, one more coffee, one step closer to a hug.','padua'],
 ['Milan','14 October','duomo','Back where the adventure began.','The suitcase is fuller. The feet are sleepier. The hug is getting closer.'],
 ['Home','Soon','home','Sasha and two very impatient tails.','Final destination: together. ♡']
].map(([name,date,landmark,caption,memory,optional])=>({name,date,landmark,caption,memory,optional}));
