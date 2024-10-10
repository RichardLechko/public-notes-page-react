import React, { useEffect, useState } from "react";
import { GraphQLClient, gql } from "graphql-request";
import Footer from "./Footer";
import "./styles/about.css";
import "./styles/web-dev.css";
import "./styles/research.css";
import "./styles/hackathon.css";
import "./styles/freedombutchers.css";

const endpoint = process.env.REACT_APP_GRAPHQL_ENDPOINT;
const client = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
  },
});

const QUERY = gql`
  query {
    notes {
      id
      title
      short {
        html
      }
      content {
        html
      }
      date
    }
  }
`;

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  function decodeHtml(html) {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = html;
    return textArea.value;
  }

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await client.request(QUERY);
        const sortedNotes = data.notes.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setNotes(sortedNotes);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching notes: {error.message}</div>;

  return (
    <div className="mx-auto text-white min-h-screen flex flex-col bg-gray-900">
      <div className="flex justify-between w-full border-b-4 border-[#2E2E2E] p-6 bg-black">
        <h1 className="text-2xl font-bold my-auto">
          <a href="/">Public Notes</a>
        </h1>
        <div className="flex justify-center items-center">
          <a
            href="https://github.com/RichardLechko"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/github-mark-white.png"
              alt="White GitHub Icon"
              className="w-16 h-auto max-w-none"
            />
          </a>
        </div>
      </div>

      <div className="pt-16 flex-grow">
        <div className="w-3/5 mx-auto h-full pb-10 max-[768px]:w-4/5">
          {selectedNote ? (
            <div className="p-8 bg-gray-800 rounded-lg shadow-md max-[640px]:px-2">
              <p className="text-sm text-gray-400 text-center mb-2 max-[425px]:text-xs">
                {formatDate(selectedNote.date)}
              </p>
              <h2 className="text-5xl mb-4 mt-2 font-semibold text-center max-[1024px]:text-4xl max-[768px]:text-3xl max-[425px]:text-2xl">
                {selectedNote.title}
              </h2>
              {selectedNote && selectedNote.content ? (
                <div className="rich-text-content">
                  <div
                    className="px-4 py-2 text-gray-100"
                    dangerouslySetInnerHTML={{
                      __html: decodeHtml(selectedNote.content.html),
                    }}
                  />
                </div>
              ) : (
                <p className="text-gray-500">No content available.</p>
              )}
            </div>
          ) : notes.length === 0 ? (
            <p className="text-gray-500 text-center">No notes available.</p>
          ) : (
            <ul className="flex flex-col items-center space-y-8 w-full">
              {notes.map((note) => (
                <li
                  key={note.id}
                  className="transform hover:scale-105 hover:shadow-lg transition-all duration-200 p-6 rounded-lg bg-gray-700 cursor-pointer max-h-64 overflow-hidden w-full max-[768px]:p-4"
                  onClick={() => handleNoteClick(note)}
                >
                  <p className="text-sm text-gray-400">
                    {formatDate(note.date)}
                  </p>
                  <h2 className="text-xl mb-2 font-semibold max-[768px]:text-lg">
                    {note.title}
                  </h2>
                  {note.short ? (
                    <div
                      className="text-gray-400 italic line-clamp-4"
                      dangerouslySetInnerHTML={{
                        __html: note.short.html,
                      }}
                    />
                  ) : (
                    <p className="text-sm text-gray-500">None to display</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;
