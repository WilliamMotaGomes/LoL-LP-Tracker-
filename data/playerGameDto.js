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

    for (const entry of data) 
    {
        if (entry.queueType === "RANKED_SOLO_5x5") 
            this.soloQueueStat = new PlayerRankedStats(entry);
        else if (entry.queueType === "RANKED_FLEX_SR") 
            this.flexQueueStat = new PlayerRankedStats(entry);  
    }
  }
}