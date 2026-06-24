import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface ESPNGame {
  id: string;
  date: string;
  name: string;
  shortName: string;
  competitions: Array<{
    id: string;
    status: {
      type: {
        state: string; // 'pre', 'in', 'post'
        completed: boolean;
        description: string;
        detail: string;
      };
    };
    competitors: Array<{
      id: string;
      team: {
        id: string;
        abbreviation: string;
        displayName: string;
        shortDisplayName: string;
        logo: string;
      };
      score: string;
      homeAway: string; // 'home' or 'away'
    }>;
  }>;
}

export interface ESPNScoreboard {
  events: ESPNGame[];
}

@Injectable({
  providedIn: 'root'
})
export class SportsService {
  private baseUrl = 'http://site.api.espn.com/apis/site/v2/sports';

  // Sport and league mappings
  private leagueMap: { [key: string]: { sport: string; league: string } } = {
    'nfl': { sport: 'football', league: 'nfl' },
    'nba': { sport: 'basketball', league: 'nba' },
    'ncaa-bb': { sport: 'basketball', league: 'mens-college-basketball' },
    'mlb': { sport: 'baseball', league: 'mlb' },
    'nhl': { sport: 'hockey', league: 'nhl' },
    'mls': { sport: 'soccer', league: 'usa.1' },
    'epl': { sport: 'soccer', league: 'eng.1' }
  };

  constructor(private http: HttpClient) {}

  getScoreboard(league: string): Observable<ESPNScoreboard> {
    const mapping = this.leagueMap[league];
    if (!mapping) {
      console.error(`Unknown league: ${league}`);
      return of({ events: [] });
    }

    const url = `${this.baseUrl}/${mapping.sport}/${mapping.league}/scoreboard`;

    return this.http.get<ESPNScoreboard>(url).pipe(
      catchError(error => {
        console.error(`Error fetching ${league} scores:`, error);
        return of({ events: [] });
      })
    );
  }

  getTeamGames(league: string, teamAbbreviation: string): Observable<ESPNGame[]> {
    return this.getScoreboard(league).pipe(
      map(scoreboard => {
        // Filter games where the team is playing
        return scoreboard.events.filter(event =>
          event.competitions[0]?.competitors.some(
            competitor => competitor.team.abbreviation === teamAbbreviation ||
                         competitor.team.displayName.toLowerCase().includes(teamAbbreviation.toLowerCase())
          )
        );
      })
    );
  }

  // Helper to map team names to ESPN abbreviations (add as needed)
  getTeamAbbreviation(teamName: string, league: string): string {
    const abbrevMap: { [key: string]: { [key: string]: string } } = {
      nfl: {
        'Buffalo Bills': 'BUF',
        'Miami Dolphins': 'MIA',
        'New England Patriots': 'NE',
        'New York Jets': 'NYJ',
        'Baltimore Ravens': 'BAL',
        'Cincinnati Bengals': 'CIN',
        'Cleveland Browns': 'CLE',
        'Pittsburgh Steelers': 'PIT',
        'Kansas City Chiefs': 'KC',
        'Las Vegas Raiders': 'LV',
        'Los Angeles Chargers': 'LAC',
        'Denver Broncos': 'DEN'
        // Add more as needed
      },
      nba: {
        'Los Angeles Lakers': 'LAL',
        'Boston Celtics': 'BOS',
        'Golden State Warriors': 'GS',
        'Miami Heat': 'MIA',
        'Milwaukee Bucks': 'MIL'
        // Add more as needed
      }
    };

    return abbrevMap[league]?.[teamName] || teamName.split(' ').pop() || teamName;
  }
}
