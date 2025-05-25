import 'dotenv/config';
import {PlayerRankedProfile,rankAccountString} from './data/playerGameDto.js';
import { writeFile,readdir, readFile  } from 'fs/promises';
import path from 'path';

const API_KEY = process.env.LOL_KEY;
const EUROPE_URL = 'https://europe.api.riotgames.com/';
const ASIA_URL = 'https://asia.api.riotgames.com/';
const AMERICA_URL = 'https://americas.api.riotgames.com/';
const ACCOUNT_DATA_ENDPOINT = 'lol/league/v4/entries/by-puuid/';
const ACCOUNT_ENDPOINT = 'riot/account/v1/accounts/by-riot-id/';
const MATCH_ENDPOINT = 'lol/spectator/v5/active-games/by-summoner/';

const REGION_ENDPOINTS = {
  BR1: 'https://br1.api.riotgames.com/',
  EUN1: 'https://eun1.api.riotgames.com/',
  EUW1: 'https://euw1.api.riotgames.com/',
  JP1: 'https://jp1.api.riotgames.com/',
  KR: 'https://kr.api.riotgames.com/',
  LA1: 'https://la1.api.riotgames.com/',
  LA2: 'https://la2.api.riotgames.com/',
  ME1: 'https://me1.api.riotgames.com/',
  NA1: 'https://na1.api.riotgames.com/',
  OC1: 'https://oc1.api.riotgames.com/',
  RU: 'https://ru.api.riotgames.com/',
  SG2: 'https://sg2.api.riotgames.com/',
  TR1: 'https://tr1.api.riotgames.com/',
  TW2: 'https://tw2.api.riotgames.com/',
  VN2: 'https://vn2.api.riotgames.com/',
};

const QUEUEID_MAP = {
    440: 'Ranked Flex',
    420: 'Ranked Soloqueue'
}


export async function setupPlayer(gameName,gameTag,region)
{
    const paramUrl = `${gameName}/${gameTag}`
    let res;
    switch(region)
    {
        case 'EUW1':
        case 'EUN1':
        case 'ME1':
        case 'RU':
        case 'TR1':
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

        case 'JP1':
        case 'KR':
        case 'SG2':
        case 'OC1':
        case 'TW2':
        case 'VN2':
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

        case 'BR1':
        case 'LA1':
        case 'LA2':
        case 'NA1':
        case 'OC1':
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

    const data = await res.json();
    if (!res.ok) 
    {
        console.log(res.status);
        console.log(JSON.stringify(data));
        return false;
    }

    if(await getAccountData(gameName,gameTag,region,data.puuid))
        return true;

    return false;
}

async function getAccountData(gameName,gameTag,region,puuid)
{
    const res = await fetch(REGION_ENDPOINTS[region]+ACCOUNT_DATA_ENDPOINT+puuid,
    {
        headers: {
            'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
            'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': 'https://developer.riotgames.com',
            'User-Agent': 'DiscordBot (https://github.com/WilliamMotaGomes/LoL-LP-Tracker-, 1.0.0)',
            'X-Riot-Token': API_KEY
        },
    });

    const data = await res.json();
    if (!res.ok) 
    {
        console.log(res.status);
        console.log(JSON.stringify(data));
        return false;
    }      
    
    if (!Array.isArray(data) || data.length == 0) 
        return false;

    const playerProfile = new PlayerRankedProfile(gameName,gameTag,region,puuid,data);
    const jsonString = JSON.stringify(playerProfile, null, 2);

    await writeFile(`players/${gameName}#${gameTag}.json`, jsonString);
    
    return true;
}

export async function isPlayerInGame()
{
    let filePath;
    let content;
    let playerData;
    let res;
    let matchData;
    let messages = [];
    
    const folderPath = './players';
    const files = await readdir(folderPath);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    console.log(jsonFiles);

    for (const file of jsonFiles) {
        filePath = path.join(folderPath, file);
        content = await readFile(filePath, 'utf-8');
        playerData = JSON.parse(content);
        console.log(REGION_ENDPOINTS[playerData.region]+MATCH_ENDPOINT+playerData.puuid);
        res = await fetch(REGION_ENDPOINTS[playerData.region]+MATCH_ENDPOINT+playerData.puuid,
        {
            headers: {
                'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
                'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Origin': 'https://developer.riotgames.com',
                'User-Agent': 'DiscordBot (https://github.com/WilliamMotaGomes/LoL-LP-Tracker-, 1.0.0)',
                'X-Riot-Token': API_KEY
            },
        });
        
        if (!res.ok)
        {
            console.log(res.status);
            console.log(JSON.stringify(res.json()));
            continue;
        } 

        matchData = await res.json();

        /*if (matchData.gameId === playerData.lastMatchId)
            //check if match is over
            continue;*/
        
        playerData.lastMatchId = matchData.gameId;
        await writeFile(filePath, JSON.stringify(playerData, null, 2));
        let message = rankAccountString(matchData.gameQueueConfigId,playerData);
        console.log(message);
        console.log('test');
        messages.push(message);     
    }

    return messages;
}