import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import "./Chat.css";
import axios from "axios";
import {Stomp} from "@stomp/stompjs";
import SockJS from 'sockjs-client';
import {useInView} from "react-intersection-observer";

/**
 * 여기서도 ChatList와 마찬가지로 소켓 통신을 위한 연결을 진행합니다.
 * 로그인하면서 저장한 사용자의 name과 userId를 가져옵니다.
 * 제가 ChatList -> Chat으로 화면전환할 때 ChatList에서 해당 채팅방에 대한 teamId를 같이 저장해놨는데, 해당 채팅방을 클릭하면 채팅방의 teamId를
 * url의 파라미터로 담아 navigate 시켰습니다. 수정하셔도 되고 어쨌든 teamId만 Chat 컴포넌트로 넘겨주시면 됩니다..
 *
 * messages는 채팅방에 입장했을 때 과거 채팅 내역 + 실시간으로 받아오는 채팅을 저장하는 상태입니다. : fetchMessage()
 * teamName, numberOfUsers는 채팅방에 입장할 때 서버에서 정보를 받아와 화면에 채팅방 이름, 채팅방 유저 숫자를 받아와 저장합니다.
 * 여기서 채팅방 무한 스크롤 방식을 적용했는데, cursorId는 화면에 보이는 가장 위 채팅의 chatId입니다.. 그냥 그대로 써주시면 편할 것 같아요
 * hasNextPage도 이와 관련이 있습니다. 무한 스크롤 방식에서 서버에서 불러올 채팅이 여전히 남아있는지 hasNextPage를 통해 검사합니다.
 * ref <- 이게 무한스크롤을 위한 친구입니다.
 * todo 버그 발견! : 새로운 채팅을 가져오려고 스크롤을 위로 올리면 스크롤바가 맨 아래로 다시 내려감
 *
 * 마찬가지로 채팅방 페이지에 오면 connect를 통해 소켓 연결을 실시하고 subscribe를 통해 실시간 채팅을 받아와 messages에 저장합니다.
 * 이 때 API 명세서를 보시면 message를 어떻게 받아오는지 적어놨습니다. 이 때 terms가 현장용어들인데 용어마다 startIndex~endIndex를 응답으로 보냈습니다.
 * 이 인덱스를 이용해서 현장용어 표시 해주시면 될 것 같아요
 * 그리고 API 명세서에 또 채팅을 어떻게 받아오는지 적어놨습니다. 이 때 read라는 값이 있는데, read = true면 사용자가 이미 읽은 메시지이고 read = false 이면
 * 사용자가 아직 읽지 않은 채팅이라 최초로 read = false가 되는 메시지부터 카카오톡처럼 "여기서 부터 읽지 않은 메시지 입니다" 같은 문구가 있으면 좋을 것 같아요
 * 채팅도 채팅방과 마찬가지로 sendTime 순서로 정렬되어 있습니다.
 *
 * 추가로 번역된 문장과 용어들에 대한 번역 + 사진을 가져와야 하는데, 일단 문장만 translatedText에 받아왔습니다.
 * translatedText는 Map 자료구조를 써서 Key로 chatId를 사용합니다. messagese들을 화면에 보여줄 때 message에도 chatId가 있는데
 * message.chatId를 key 값으로 Map에서 translatedText를 꺼내 화면에 보여주시면 됩니다.
 *
 * joinTeam, leaveTeam은 그냥 채팅방 들어왔따 나갔다 하는 함수입니다.
 * sendMessage는 채팅을 보내는 함수입니다. 여기서 "할 일"이라면 체크표시를 할텐데 체크되면 todo에 true로 넘겨주시면 됩니다.
 *
 * messages를 화면에 보여줄 때 로컬스토리지에서 가져온 userName을 이용해 내 채팅은 오른쪽에 보이게 해놨습니다.
 */
const Chat = () => {
  const navigate = useNavigate();
  const stompClient = useRef(null);
  const messageListRef = useRef(null);

  const {teamId} = useParams();
  const name = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");

  const [messages, setMessages] = new useState([]);
  const [input, setInput] = new useState("");
  const [translatedTexts, setTranslatedTexts] = new useState(new Map());
  const [visibleTexts, setVisibleTexts] = useState(new Map());

  const [teamName, setTeamName] = new useState("");
  const [numberOfUsers, setNumberOfUsers] = new useState(0);

  const [cursorId, setCursorId] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [ref, inView] = useInView();

  useEffect(() => {
    const connect = () => {
      const socket = new SockJS("http://localhost:8080/ws-connect");
      stompClient.current = Stomp.over(socket);
      stompClient.current.connect({}, () => {
        stompClient.current.subscribe(`/sub/chats/${teamId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          console.log(newMessage);
          setMessages((prevMessages) => [...prevMessages, newMessage]);

          if (messageListRef.current) {
            setTimeout(() => {
              messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
            }, 0);
          }
        });

        stompClient.current.subscribe(`/sub/translate/${teamId}/${userId}`, (message) => {
          const {chatId, translatedTerms, translatedText} = JSON.parse(message.body);
          console.log(translatedTerms);
          setTranslatedTexts((prevMap) => {
            const newMap = new Map(prevMap);
            newMap.set(chatId, translatedText);
            return newMap;
          });
        })
      });
    };

    const joinTeam = async () => {
      const response = await axios.post(`http://localhost:8080/teams/${teamId}/users/${userId}/join`);
      setTeamName(response.data.result.teamName);
      setNumberOfUsers(response.data.result.numberOfUsers);
    }

    connect();
    joinTeam();

    return () => disconnect();
  }, [setMessages, userId, teamId]);

  useEffect(() => {
    fetchMessage();
  }, []);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchMessage();
      console.log(messages);
    }
  }, [hasNextPage, inView]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessage = () => {
    return axios.get(`http://localhost:8080/chats/teams/${teamId}?userId=${userId}&cursorId=${cursorId}`).then(response => {
      const {messages, hasNext} = response.data.result;
      const reversedMessages = [...messages].reverse();
      setMessages(prevMessage => [...reversedMessages, ...prevMessage]);
      const newCursorId = reversedMessages.length > 0 ? reversedMessages[0].chatId : null;

      setTranslatedTexts(prevMap => {
        const newMap = new Map(prevMap);
        messages.forEach(msg => {
          newMap.set(msg.chatId, msg.translatedMessage);
        });
        return newMap;
      });

      setCursorId(newCursorId);
      setHasNextPage(hasNext);
    });
  };

  const leaveTeam = async () => {
    await axios.post(`http://localhost:8080/teams/${teamId}/users/${userId}/leave`)
    navigate("/chatList");
  };

  const disconnect = () => {
    if (stompClient.current) {
      stompClient.current.disconnect();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
  }

  const sendMessage = () => {
    if (stompClient.current && input) {
      const body = {
        userId: userId,
        name: name,
        message: input,
        todo: false
      };
      stompClient.current.send(`/pub/chats/teams/${teamId}`, {}, JSON.stringify(body));
      setInput('');
    }
  }

  return (
      <div className="chat-container">
        <div className="chat-card">
          <h2 className="chat-title">💬 채팅방 {teamName} - {name}님 - {numberOfUsers}명</h2>
          <div className="chat-content" ref={messageListRef}>
            <ul className="message-list">
              <div ref={ref}/>
              {messages.map((msg, index) => {
                const chatId = msg.chatId;
                const hasTranslation = translatedTexts.has(chatId); // 번역 데이터 존재 여부

                return (
                    <li
                        key={index}
                        className={`message-item ${msg.name !== name ? "my-message" : "other-message"}`}
                        style={{ display: "flex", flexDirection: "column" }} // 수직 정렬
                    >
                      <div>
                        <strong>{msg.name}: </strong>{msg.message}
                      </div>

                      {/* 번역 버튼 (메시지 아래 배치) */}
                      <button
                          onClick={() => {
                            setVisibleTexts((prev) => {
                              const newMap = new Map(prev);
                              newMap.set(chatId, !newMap.get(chatId)); // 토글 방식
                              return newMap;
                            });
                          }}
                          disabled={!hasTranslation} // 번역 데이터 없으면 비활성화
                          style={{
                            marginTop: "5px",
                            alignSelf: "flex-start",
                            cursor: hasTranslation ? "pointer" : "not-allowed",
                            opacity: hasTranslation ? 1 : 0.5,
                          }}
                      >
                        {visibleTexts.get(chatId) ? "번역 숨기기" : "번역 보기"}
                      </button>

                      {/* 번역된 문장 출력 (버튼 아래에 배치) */}
                      {visibleTexts.get(chatId) && hasTranslation && (
                          <p style={{ marginTop: "5px", fontStyle: "italic", color: "#555" }}>
                            {translatedTexts.get(chatId)}
                          </p>
                      )}
                    </li>
                );
              })}
            </ul>
          </div>
          <div className="chat-input">
            <input
                type="text"
                value={input}
                onChange={handleInput}
                className="chat-input-field"
                placeholder="메시지를 입력하세요..."
            />
            <button onClick={sendMessage} className="chat-send-button">
              전송
            </button>
          </div>
          <button onClick={leaveTeam} className="exit-link">
            🔙 채팅방 나가기
          </button>
        </div>
      </div>
  );
};

export default Chat;