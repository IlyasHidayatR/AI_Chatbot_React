import './App.css'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { requestAI } from '../utils/groq'
import { Loading } from '../component/loading'
import React, { useState } from 'react'

function App() {

  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const message = document.getElementById('message').value
    setLoading(true)
    try{
      const response = await requestAI(message)
      console.log(response)
      setMessages([...messages.slice(0, messages.length - 1), response.choices[0].message.content])
      setLoading(false)
    }
    catch (error) {
      console.error(error)
      setMessages([...messages.slice(0, messages.length - 1), 'Sorry, I am not able to understand your message or there was an error.'])
      setLoading(false)
    }
    document.getElementById('message').value = ''
  }

  const renderMessageContent = (content) => {
    if (content.includes('```')) {
      const code = content.split('```').slice(1, -1).join('```')
      return (
        <SyntaxHighlighter language="swift" style={darcula} wrapLongLines={true}>
          {code}
        </SyntaxHighlighter>
      )
    } else {
      const html = content.replace(
        /(\*\*|__)(.+?)(\*\*|__|_(=){4,})/g,
        (match, bold, text, underline) => {
          if (bold) {
            return `<strong>${text}</strong>`;
          } else if (underline) {
            return `<u>${text}</u>`;
          } else {
            return `<em>${text}</em>`;
          }
        }
      );
      return <p className="text-white text-left whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: html }}></p>;
    }
  }

  return (
    <main className="flex flex-col items-center justify-center space-y-4 min-h-screen">
      <h1 className="text-4xl text-indigo-700">AI Chatbot</h1>
      <form className="flex items-center space-x-2 mt-4" onSubmit={handleSubmit}>
        <input type="text" className="border border-gray-300 px-4 py-2 rounded-lg" placeholder="Type your message..." id="message" />
        <button type="submit" className="bg-indigo-700 text-white px-4 py-2 rounded-lg">Send</button>
      </form>
      {loading && (
        <div className="mt-4">
          <Loading />
        </div>
      )}
      <div className="flex flex-col mt-4 w-full overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="border border-white text-white p-4 rounded-lg">
            {renderMessageContent(message)}
          </div>
        ))}
      </div>
    </main>
  );
}

export default App
