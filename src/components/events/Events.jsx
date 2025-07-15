import { SimpleGrid } from "@chakra-ui/react";
import EventsCards from "./EventsCards";
import { useColorModeValue } from "@chakra-ui/react";

export const Events = ({ events }) => {
    return (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={8} color={useColorModeValue('black', 'white')} >
            {events.map((e) => (
                <EventsCards
                    key={e._id}
                    events={e}
                />
            ))}
        </SimpleGrid>
    )

}