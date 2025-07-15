import { useSpring, animated, to } from '@react-spring/web';
import {
  Card,
  CardBody,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Box,
  Icon,
  Skeleton,
  useColorModeValue
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
const AnimatedSpan = animated('span');

const StatsCard = ({ stat, isLoading }) => {
  const [targetValue, setTargetValue] = useState(0);
  const [targetChange, setTargetChange] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setTargetValue(typeof stat.value === 'number' ? stat.value : 0);
      setTargetChange(Math.abs(stat.change));
    }
  }, [isLoading, stat.value, stat.change]);

  const valueSpring = useSpring({
    from: { val: 0 },
    to: { val: targetValue },
    config: { tension: 40, friction: 12 },
    reset: true
  });

  const changeSpring = useSpring({
    from: { val: 0 },
    to: { val: targetChange },
    config: { tension: 40, friction: 14 },
    reset: true
  });

  return (
    <Card
      bg={useColorModeValue('white', 'gray.700')}
      boxShadow="sm"
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{
        boxShadow: 'md',
        transform: 'translateY(-2px)',
        bg: useColorModeValue('gray.50', 'gray.600')
      }}
      borderLeft="4px solid"
      borderColor={`${stat.color}.500`}
    >
      <CardBody p={4}>
        <Flex justify="space-between" align="center">
          <Stat>
            <StatLabel color="gray.500" fontWeight="medium">
              {stat.label}
            </StatLabel>

            <Skeleton isLoaded={!isLoading}>
              <StatNumber fontSize="2xl" fontWeight="bold">
                <AnimatedSpan>
                  {to(valueSpring.val, val => {
                    const numberVal = Number(val);
                    if (Number.isNaN(numberVal)) return '';
                    const formatted = Math.floor(numberVal).toLocaleString();
                    return stat.prefix
                      ? `${stat.prefix}${formatted}${stat.suffix || ''}`
                      : `${formatted}${stat.suffix || ''}`;
                  })}
                </AnimatedSpan>
              </StatNumber>
            </Skeleton>

            <Skeleton isLoaded={!isLoading}>
              <StatHelpText mb={0}>
                <StatArrow type={stat.change > 0 ? 'increase' : 'decrease'} />
                <AnimatedSpan>
                  {to(changeSpring.val, val => `${Math.floor(val)}% desde ayer`)}
                </AnimatedSpan>
              </StatHelpText>
            </Skeleton>
          </Stat>

          <Box p={3} bg={`${stat.color}.50`} borderRadius="lg" color={`${stat.color}.500`}>
            <Icon as={stat.icon} boxSize={6} />
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default StatsCard;
