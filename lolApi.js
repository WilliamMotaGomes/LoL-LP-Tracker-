import 'dotenv/config';

const EUROPE_URL = 'https://europe.api.riotgames.com/'
const ASIA_URL = 'https://asia.api.riotgames.com/'
const AMERICA_URL = 'https://americas.api.riotgames.com/'
const ACCOUNT_ENDPOINT = 'riot/account/v1/accounts/by-riot-id/'
const API_KEY = process.env.LOL_KEY;

export async function checkIfPlayerExist(gameName,gameTag,region)
{
    const paramUrl = `${gameName}/${gameTag}`
    let res;
    switch(region)
    {
        case 'EUROPE':
            res = await fetch(EUROPE_URL+ACCOUNT_ENDPOINT+paramUrl,
            {
            headers: {
            'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
            'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': 'https://developer.riotgames.com',
            'User-Agent': 'DiscordBot (https://github.com/WilliamMotaGomes/LoL-LP-Tracker-, 1.0.0)',
            'X-Riot-Token': API_KEY
            },
            });
            
        break;

        case 'ASIA':
            res = await fetch(ASIA_URL+ACCOUNT_ENDPOINT+paramUrl,
            {
            headers: {
            'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
            'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': 'https://developer.riotgames.com',
            'User-Agent': 'DiscordBot (https://github.com/WilliamMotaGomes/LoL-LP-Tracker-, 1.0.0)',
            'X-Riot-Token': API_KEY
            },
            });

        break;

        case 'AMERICAS':
            res = await fetch(AMERICA_URL+ACCOUNT_ENDPOINT+paramUrl,
            {
            headers: {
            'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
            'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': 'https://developer.riotgames.com',
            'User-Agent': 'DiscordBot (https://github.com/WilliamMotaGomes/LoL-LP-Tracker-, 1.0.0)',
            'X-Riot-Token': API_KEY
            },
            });

        break;
    }

    if (!res.ok) 
    {
        const data = await res.json();
        console.log(res.status);
        console.log(JSON.stringify(data));
        return false;
    }

    return true;
}