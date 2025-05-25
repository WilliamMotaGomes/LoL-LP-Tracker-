class PlayerRankedStats 
{
  constructor(data) 
  {
    this.tier = data.tier;
    this.rank = data.rank;
    this.leaguePoints = data.leaguePoints;
    this.wins = data.wins;
    this.losses = data.losses;
  }
}

export class PlayerRankedProfile 
{
  constructor(gameName,gameTag,region,puuid,data) 
  {
    this.puuid = puuid;
    this.gameName = gameName;
    this.gameTag = gameTag;
    this.region = region;
    this.lastMatchId = 0;

    for (const entry of data) 
    {
        if (entry.queueType === "RANKED_SOLO_5x5") 
            this.soloQueueStat = new PlayerRankedStats(entry);
        else if (entry.queueType === "RANKED_FLEX_SR") 
            this.flexQueueStat = new PlayerRankedStats(entry);  
    }
  }
}

export function rankAccountString(queueId,playerData)
{
  let rankedData;
  
  if(queueId === 420)
  {
    rankedData = playerData.soloQueueStat;
    return `${playerData.gameName} (${rankedData.tier} ${rankedData.tier === 'CHALLENGER' || rankedData.tier === 'MASTER' ? rankedData.leaguePoints : (rankedData.rank + " "+rankedData.leaguePoints)} LP) is currently in a SoloQ Ranked Game`;
  }
  else if (queueId === 440)
  {
    rankedData = playerData.flexQueueStat;
    return `${playerData.gameName} (${rankedData.tier} ${rankedData.tier === 'CHALLENGER' || rankedData.tier === 'MASTER' ? rankedData.leaguePoints : (rankedData.rank + " "+rankedData.leaguePoints)} LP) is currently in a Flex Ranked Game`;    
  }
}