import React, { useState } from 'react';
import {
  Box, Input, Button, VStack, Text, HStack, Spinner, IconButton, useColorModeValue
} from '@chakra-ui/react';
import { ChatIcon, CloseIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hola, ¿cómo puedo ayudarte?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const chatBg = useColorModeValue('white', 'gray.800');
  const userMsgBg = useColorModeValue('teal.500', 'teal.400');
  const botMsgBg = useColorModeValue('gray.200', 'gray.600');
  const userTextColor = useColorModeValue('white', 'white');
  const botTextColor = useColorModeValue('black', 'white');

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        'https://api.cohere.ai/v1/chat',
        {
          message: input,
          model: 'command-r',
        },
        {
          headers: {
            Authorization: `Bearer klsgYPpbOP1obNdWDYrJvmRC1vwHDpxXtSoR9iAa`,
            'Content-Type': 'application/json',
          },
        }
      );

      const reply = response.data.text;
      setMessages([...newMessages, { role: 'bot', content: reply }]);
    } catch (error) {
      console.error('Error al llamar a Cohere:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box position="fixed" bottom="6" right="6" zIndex="tooltip">
        <IconButton
          aria-label="Abrir chat"
          icon={
            <AnimatePresence mode="wait">
              <MotionBox
                key={isChatOpen ? 'close' : 'chat'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isChatOpen ? <CloseIcon /> : <ChatIcon />}
              </MotionBox>
            </AnimatePresence>
          }
          colorScheme="teal"
          size="lg"
          isRound
          shadow="lg"
          onClick={() => setIsChatOpen(!isChatOpen)}
        />
      </Box>

      <AnimatePresence>
        {isChatOpen && (
          <MotionBox
            key="chatbox"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            position="fixed"
            bottom="20"
            right="6"
            bg={chatBg}
            borderRadius="lg"
            boxShadow="2xl"
            w={{ base: '90%', md: '400px' }}
            maxH="500px"
            p={4}
            zIndex={999}
          >
            <VStack spacing={3} maxH="320px" overflowY="auto">
              {messages.map((msg, idx) => (
                <HStack key={idx} alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}>
                  <Box
                    bg={msg.role === 'user' ? userMsgBg : botMsgBg}
                    color={msg.role === 'user' ? userTextColor : botTextColor}
                    p={2}
                    borderRadius="md"
                    maxW="75%"
                  >
                    <Text>{msg.content}</Text>
                  </Box>
                </HStack>
              ))}
              {loading && <Spinner />}
            </VStack>
            <HStack mt={3}>
              <Input
                placeholder="Escribe tu mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button onClick={handleSend} colorScheme="teal">
                Enviar
              </Button>
            </HStack>
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
