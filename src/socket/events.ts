const EVENTS = {
    connection: 'connetion',
    CLIENT: {
        CREATE_OR_JOIN_ROOM: "CREATE_OR_JOIN_ROOM",
        SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE"
    },
    SERVER: {
        ROOMS: "ROOMS",
        JOINED_ROOM: "JOINED_ROOM",
        ROOM_MESSAGE: "ROOM_MESSAGE"
    }
}

export default EVENTS;