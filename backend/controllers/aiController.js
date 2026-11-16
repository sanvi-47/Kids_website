// Kids AI Assistant with safety moderation & rich child-friendly responses

const SAFETY_BANNED_WORDS = [
  'kill', 'blood', 'weapon', 'gun', 'hate', 'stupid', 'curse', 'die', 'murder', 'bomb', 'harm', 'drugs'
];

export const chatWithAI = async (req, res) => {
  try {
    const { prompt, mode = 'coding_help', age = 9 } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Please say or ask something to Sparky AI!' });
    }

    const lower = prompt.toLowerCase();
    const hasUnsafeWord = SAFETY_BANNED_WORDS.some(word => lower.includes(word));

    if (hasUnsafeWord) {
      return res.json({
        reply: "🛡️ Sparky AI Safety Shield: That doesn't seem kind or safe for our coding playground! Let's build something cheerful like a spaceship game, dancing cat, or a treasure quest instead!",
        isSafe: false,
        demoMode: true
      });
    }

    // Check if external Gemini API key is configured
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim() !== '') {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{
                text: "You are Sparky AI, an enthusiastic, safe, kind, and encouraging coding robot buddy for kids aged 6-14. Explain programming (loops, variables, events, sprite coordinates) using visual metaphors like LEGO bricks, recipes, and games. Always be cheerful, concise, and use fun emojis. Never provide adult, scary, or unsafe answers."
              }]
            },
            contents: [{
              parts: [{ text: prompt }]
            }]
          })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          return res.json({
            reply: data.candidates[0].content.parts[0].text,
            isSafe: true,
            demoMode: false
          });
        }
      } catch (apiErr) {
        console.warn('Gemini API call failed, falling back to smart kid-safe simulation engine', apiErr);
      }
    }

    // Smart, high-quality, simulated child-friendly AI engine (Demo Mode)
    let reply = "";
    if (lower.includes('game') && (lower.includes('idea') || lower.includes('create'))) {
      const ideas = [
        "🌟 **Cosmic Fruit Catcher**: Control a friendly alien with arrow keys to catch falling juicy pineapples while dodging cosmic space-bubbles!",
        "🏰 **Magic Castle Maze**: Guide a wizard puppy through a stone labyrinth using arrow blocks and find the enchanted diamond!",
        "🏎️ **Turbo Turtle Racing**: Two turtles race across the beach. Press SPACE to turbo-boost when a green flag waves!",
        "🦘 **Jumping Kangaroos**: Avoid bouncing obstacles by jumping when you tap the UP arrow key!"
      ];
      reply = ideas[Math.floor(Math.random() * ideas.length)] + "\n\nTip: You can use our **Game Studio** to assemble this with colorful motion blocks right now!";
    } else if (lower.includes('loop') || lower.includes('repeat')) {
      reply = "🔁 **What is a Loop?** Think of it like dancing to your favorite song chorus! Instead of saying 'Hop, Hop, Hop, Hop', you can just say 'Repeat 4 times: Hop!'. It saves your energy and makes your computer code super clean and fast! 🚀";
    } else if (lower.includes('variable')) {
      reply = "📦 **Variables are Magic Boxes!** Imagine having a little box with a label on it called 'Score'. Every time your hero catches a coin, you drop +1 into the box! When you need to know how many coins you have, just peek inside the box! 🪙✨";
    } else if (lower.includes('bug') || lower.includes('error') || lower.includes('not working')) {
      reply = "🐞 **Debugging is Detective Work!** Even top rocket scientists have bugs in their code! Check these 3 clues:\n1. Did you connect the 'When Green Flag Clicked' block first?\n2. Are your coordinate numbers (X and Y) moving in the right direction?\n3. Is your Forever loop running? Try pressing Stop then Green Flag again! 🔍";
    } else if (lower.includes('story') || lower.includes('character')) {
      reply = "📖 **Story Sparks:** Imagine a robot named Sparky who woke up on Mars and wanted to learn how to bake a chocolate cookie! What character will help him find the magic chocolate crystals? Head to the **Story Studio** to build the scenes!";
    } else if (lower.includes('ai') || lower.includes('artificial intelligence') || lower.includes('ethical')) {
      reply = "🤖 **What is Ethical AI?** Artificial Intelligence is like teaching computers how to learn from patterns, just like you learn to recognize dogs and cats! 'Ethical AI' means teaching computers to be kind, fair to everyone, truthful, and helpful without hurting our planet or feelings! 🌍❤️";
    } else {
      reply = `🤖 Beep Boop! I love how you asked: "${prompt}"!
Here is a super coder tip: In visual programming, every block tells the computer a tiny instruction step. Try chaining a **Move 10 Steps** block with a **Turn 15 Degrees** block inside a **Forever** loop and watch your character dance! What should we create next? 🎉`;
    }

    return res.json({
      reply,
      isSafe: true,
      demoMode: true,
      hint: "Demo Mode active. Real-time Gemini 1.5 Flash API can also be enabled by adding GEMINI_API_KEY in backend/.env"
    });

  } catch (err) {
    res.status(500).json({ error: 'Failed to process AI assistant request' });
  }
};

