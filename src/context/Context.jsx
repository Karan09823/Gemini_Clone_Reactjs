import React, { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  // Function to append words with a delay for animation-like display
  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  // Function to start a new chat
  const newChat = () => {
    setInput("");
    setResultData("");
    setLoading(false);
    setShowResult(false);
  };

  // Function to handle sending a prompt
  const onSent = async (prompt) => {
    if (!(prompt || input.trim())) return; // Prevent empty input submissions

    setResultData("");
    setLoading(true);
    setShowResult(true);

    const activePrompt = prompt || input;
    setRecentPrompt(activePrompt);

    if (!prompt) setPrevPrompts((prev) => [...prev, activePrompt]);

    try {
      // Fetch the result from the external API
      const result = await run(activePrompt);

      // Process the result: Split by "**" for bold text, and replace "*" with `<br>`
      const responseArray = result.split("**");
      let formattedResponse = responseArray
        .map((segment, index) =>
          index % 2 === 1 ? `<b>${segment}</b>` : segment
        )
        .join("");

      formattedResponse = formattedResponse.replace(/\*/g, "<br>");
      const wordsArray = formattedResponse.split(" ");

      // Append each word with a delay for smooth rendering
      wordsArray.forEach((word, i) => {
        delayPara(i, word + " ");
      });
    } catch (error) {
      console.error("Error fetching response:", error);
      setResultData("Error fetching response.");
    } finally {
      setLoading(false);
    }
  };

  // Context value to share across the app
  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    showResult,
    setShowResult,
    loading,
    setLoading,
    resultData,
    setResultData,
    recentPrompt,
    setRecentPrompt,
    input,
    setInput,
    onSent,
    newChat,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default ContextProvider;
