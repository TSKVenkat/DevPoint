document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && (e.key === 'U' || e.shiftKey && e.key === 'I')) {
    e.preventDefault();
  }
});

// Replace <YOUR_API_KEY_HERE> with your actual API key
const apiKey = process.env.API;
const apiurl = 'https://api.groq.com/openai/v1/chat/completions';

var prompt = "generate code to find odd numbers"

const res = await fetch(apiurl,{
  method:"POST",
  headers:{
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": 'application/json'
  },
  body:JSON.stringify(
    {
      "model" : "llama-3.2-11b-vision-preview",
      "messages":[{
        role: "user",
        content: `${prompt}`
      }]
    }
  )
})

const data = await res.json();
console.log(data.choices[0].message.content);