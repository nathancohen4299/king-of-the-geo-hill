export function getGameState(game_id) {
    fetch('https://bulldog.ryanjchen.com/game/score/' + game_id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((response) => {
        if (response.status == 200) {
            return response.json()
        }
        else {
            console.log('[error ' + response.status + ']: ' + response.statusText)
        }
    }).then(responseJson => {
        if (responseJson !== undefined) {
            console.log(responseJson)
            return {
                control: responseJson['control'],
                duration: responseJson['duration'],
            }    
        }
    }).catch((error) => {
        console.error(error);
    });
}