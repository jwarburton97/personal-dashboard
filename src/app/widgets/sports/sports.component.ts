import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SportsService } from '../../services/sports.service';
import { forkJoin } from 'rxjs';

interface Team {
  id: string;
  name: string;
  logo?: string;
  sport: string;
  league: string;
}

interface Game {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string; // 'live', 'final', 'scheduled'
  time?: string;
}

type SelectionStep = 'sport' | 'league' | 'conference' | 'team' | 'scores';

@Component({
  selector: 'app-sports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sports.component.html',
  styleUrl: './sports.component.css'
})
export class SportsComponent implements OnInit {
  currentStep: SelectionStep = 'sport';
  selectedSport: string = '';
  selectedLeague: string = '';
  selectedConference: string = '';
  favoriteTeams: Team[] = [];
  games: Game[] = [];

  constructor(private sportsService: SportsService) {}

  sports = [
    { id: 'football', name: 'Football', icon: '🏈' },
    { id: 'basketball', name: 'Basketball', icon: '🏀' },
    { id: 'baseball', name: 'Baseball', icon: '⚾' },
    { id: 'hockey', name: 'Hockey', icon: '🏒' },
    { id: 'soccer', name: 'Soccer', icon: '⚽' }
  ];

  leagues: { [sport: string]: { id: string; name: string }[] } = {
    football: [
      { id: 'nfl', name: 'NFL' },
      { id: 'ncaa-fb', name: 'NCAA Football' }
    ],
    basketball: [
      { id: 'nba', name: 'NBA' },
      { id: 'ncaa-bb', name: 'NCAA Basketball' }
    ],
    baseball: [
      { id: 'mlb', name: 'MLB' },
      { id: 'milb', name: 'Minor League' }
    ],
    hockey: [
      { id: 'nhl', name: 'NHL' }
    ],
    soccer: [
      { id: 'mls', name: 'MLS' },
      { id: 'epl', name: 'Premier League' },
      { id: 'laliga', name: 'La Liga' }
    ]
  };

  conferences: { [league: string]: { id: string; name: string }[] } = {
    'ncaa-fb': [
      { id: 'sec', name: 'SEC' },
      { id: 'big10', name: 'Big Ten' },
      { id: 'big12', name: 'Big 12' },
      { id: 'acc', name: 'ACC' },
      { id: 'pac12', name: 'Pac-12' },
      { id: 'aac', name: 'American' },
      { id: 'mw', name: 'Mountain West' },
      { id: 'sunbelt', name: 'Sun Belt' },
      { id: 'mac', name: 'MAC' },
      { id: 'cusa', name: 'C-USA' }
    ],
    'ncaa-bb': [
      { id: 'sec', name: 'SEC' },
      { id: 'big10', name: 'Big Ten' },
      { id: 'big12', name: 'Big 12' },
      { id: 'acc', name: 'ACC' },
      { id: 'pac12', name: 'Pac-12' },
      { id: 'big-east', name: 'Big East' },
      { id: 'aac', name: 'American' },
      { id: 'mw', name: 'Mountain West' },
      { id: 'wcc', name: 'WCC' },
      { id: 'a10', name: 'Atlantic 10' }
    ]
  };

  teams: { [league: string]: { id: string; name: string; city: string }[] } = {
    nfl: [
      { id: 'buf', name: 'Bills', city: 'Buffalo' },
      { id: 'mia', name: 'Dolphins', city: 'Miami' },
      { id: 'ne', name: 'Patriots', city: 'New England' },
      { id: 'nyj', name: 'Jets', city: 'New York' },
      { id: 'bal', name: 'Ravens', city: 'Baltimore' },
      { id: 'cin', name: 'Bengals', city: 'Cincinnati' },
      { id: 'cle', name: 'Browns', city: 'Cleveland' },
      { id: 'pit', name: 'Steelers', city: 'Pittsburgh' },
      { id: 'hou', name: 'Texans', city: 'Houston' },
      { id: 'ind', name: 'Colts', city: 'Indianapolis' },
      { id: 'jax', name: 'Jaguars', city: 'Jacksonville' },
      { id: 'ten', name: 'Titans', city: 'Tennessee' },
      { id: 'den', name: 'Broncos', city: 'Denver' },
      { id: 'kc', name: 'Chiefs', city: 'Kansas City' },
      { id: 'lv', name: 'Raiders', city: 'Las Vegas' },
      { id: 'lac', name: 'Chargers', city: 'Los Angeles' },
      { id: 'dal', name: 'Cowboys', city: 'Dallas' },
      { id: 'nyg', name: 'Giants', city: 'New York' },
      { id: 'phi', name: 'Eagles', city: 'Philadelphia' },
      { id: 'was', name: 'Commanders', city: 'Washington' },
      { id: 'chi', name: 'Bears', city: 'Chicago' },
      { id: 'det', name: 'Lions', city: 'Detroit' },
      { id: 'gb', name: 'Packers', city: 'Green Bay' },
      { id: 'min', name: 'Vikings', city: 'Minnesota' },
      { id: 'atl', name: 'Falcons', city: 'Atlanta' },
      { id: 'car', name: 'Panthers', city: 'Carolina' },
      { id: 'no', name: 'Saints', city: 'New Orleans' },
      { id: 'tb', name: 'Buccaneers', city: 'Tampa Bay' },
      { id: 'ari', name: 'Cardinals', city: 'Arizona' },
      { id: 'lar', name: 'Rams', city: 'Los Angeles' },
      { id: 'sf', name: '49ers', city: 'San Francisco' },
      { id: 'sea', name: 'Seahawks', city: 'Seattle' }
    ],
    nba: [
      { id: 'atl', name: 'Hawks', city: 'Atlanta' },
      { id: 'bos', name: 'Celtics', city: 'Boston' },
      { id: 'bkn', name: 'Nets', city: 'Brooklyn' },
      { id: 'cha', name: 'Hornets', city: 'Charlotte' },
      { id: 'chi', name: 'Bulls', city: 'Chicago' },
      { id: 'cle', name: 'Cavaliers', city: 'Cleveland' },
      { id: 'dal', name: 'Mavericks', city: 'Dallas' },
      { id: 'den', name: 'Nuggets', city: 'Denver' },
      { id: 'det', name: 'Pistons', city: 'Detroit' },
      { id: 'gs', name: 'Warriors', city: 'Golden State' },
      { id: 'hou', name: 'Rockets', city: 'Houston' },
      { id: 'ind', name: 'Pacers', city: 'Indiana' },
      { id: 'lac', name: 'Clippers', city: 'LA' },
      { id: 'lal', name: 'Lakers', city: 'Los Angeles' },
      { id: 'mem', name: 'Grizzlies', city: 'Memphis' },
      { id: 'mia', name: 'Heat', city: 'Miami' },
      { id: 'mil', name: 'Bucks', city: 'Milwaukee' },
      { id: 'min', name: 'Timberwolves', city: 'Minnesota' },
      { id: 'no', name: 'Pelicans', city: 'New Orleans' },
      { id: 'ny', name: 'Knicks', city: 'New York' },
      { id: 'okc', name: 'Thunder', city: 'Oklahoma City' },
      { id: 'orl', name: 'Magic', city: 'Orlando' },
      { id: 'phi', name: '76ers', city: 'Philadelphia' },
      { id: 'phx', name: 'Suns', city: 'Phoenix' },
      { id: 'por', name: 'Trail Blazers', city: 'Portland' },
      { id: 'sac', name: 'Kings', city: 'Sacramento' },
      { id: 'sa', name: 'Spurs', city: 'San Antonio' },
      { id: 'tor', name: 'Raptors', city: 'Toronto' },
      { id: 'uta', name: 'Jazz', city: 'Utah' },
      { id: 'was', name: 'Wizards', city: 'Washington' }
    ],
    mlb: [
      { id: 'ari', name: 'Diamondbacks', city: 'Arizona' },
      { id: 'atl', name: 'Braves', city: 'Atlanta' },
      { id: 'bal', name: 'Orioles', city: 'Baltimore' },
      { id: 'bos', name: 'Red Sox', city: 'Boston' },
      { id: 'chc', name: 'Cubs', city: 'Chicago' },
      { id: 'chw', name: 'White Sox', city: 'Chicago' },
      { id: 'cin', name: 'Reds', city: 'Cincinnati' },
      { id: 'cle', name: 'Guardians', city: 'Cleveland' },
      { id: 'col', name: 'Rockies', city: 'Colorado' },
      { id: 'det', name: 'Tigers', city: 'Detroit' },
      { id: 'hou', name: 'Astros', city: 'Houston' },
      { id: 'kc', name: 'Royals', city: 'Kansas City' },
      { id: 'laa', name: 'Angels', city: 'Los Angeles' },
      { id: 'lad', name: 'Dodgers', city: 'Los Angeles' },
      { id: 'mia', name: 'Marlins', city: 'Miami' },
      { id: 'mil', name: 'Brewers', city: 'Milwaukee' },
      { id: 'min', name: 'Twins', city: 'Minnesota' },
      { id: 'nym', name: 'Mets', city: 'New York' },
      { id: 'nyy', name: 'Yankees', city: 'New York' },
      { id: 'oak', name: 'Athletics', city: 'Oakland' },
      { id: 'phi', name: 'Phillies', city: 'Philadelphia' },
      { id: 'pit', name: 'Pirates', city: 'Pittsburgh' },
      { id: 'sd', name: 'Padres', city: 'San Diego' },
      { id: 'sf', name: 'Giants', city: 'San Francisco' },
      { id: 'sea', name: 'Mariners', city: 'Seattle' },
      { id: 'stl', name: 'Cardinals', city: 'St. Louis' },
      { id: 'tb', name: 'Rays', city: 'Tampa Bay' },
      { id: 'tex', name: 'Rangers', city: 'Texas' },
      { id: 'tor', name: 'Blue Jays', city: 'Toronto' },
      { id: 'was', name: 'Nationals', city: 'Washington' }
    ],
    nhl: [
      { id: 'ana', name: 'Ducks', city: 'Anaheim' },
      { id: 'bos', name: 'Bruins', city: 'Boston' },
      { id: 'buf', name: 'Sabres', city: 'Buffalo' },
      { id: 'cgy', name: 'Flames', city: 'Calgary' },
      { id: 'car', name: 'Hurricanes', city: 'Carolina' },
      { id: 'chi', name: 'Blackhawks', city: 'Chicago' },
      { id: 'col', name: 'Avalanche', city: 'Colorado' },
      { id: 'cbj', name: 'Blue Jackets', city: 'Columbus' },
      { id: 'dal', name: 'Stars', city: 'Dallas' },
      { id: 'det', name: 'Red Wings', city: 'Detroit' },
      { id: 'edm', name: 'Oilers', city: 'Edmonton' },
      { id: 'fla', name: 'Panthers', city: 'Florida' },
      { id: 'la', name: 'Kings', city: 'Los Angeles' },
      { id: 'min', name: 'Wild', city: 'Minnesota' },
      { id: 'mtl', name: 'Canadiens', city: 'Montreal' },
      { id: 'nsh', name: 'Predators', city: 'Nashville' },
      { id: 'nj', name: 'Devils', city: 'New Jersey' },
      { id: 'nyi', name: 'Islanders', city: 'New York' },
      { id: 'nyr', name: 'Rangers', city: 'New York' },
      { id: 'ott', name: 'Senators', city: 'Ottawa' },
      { id: 'phi', name: 'Flyers', city: 'Philadelphia' },
      { id: 'pit', name: 'Penguins', city: 'Pittsburgh' },
      { id: 'sj', name: 'Sharks', city: 'San Jose' },
      { id: 'sea', name: 'Kraken', city: 'Seattle' },
      { id: 'stl', name: 'Blues', city: 'St. Louis' },
      { id: 'tb', name: 'Lightning', city: 'Tampa Bay' },
      { id: 'tor', name: 'Maple Leafs', city: 'Toronto' },
      { id: 'van', name: 'Canucks', city: 'Vancouver' },
      { id: 'vgk', name: 'Golden Knights', city: 'Vegas' },
      { id: 'wpg', name: 'Jets', city: 'Winnipeg' },
      { id: 'wsh', name: 'Capitals', city: 'Washington' },
      { id: 'ari', name: 'Coyotes', city: 'Arizona' }
    ],
    mls: [
      { id: 'atl', name: 'United', city: 'Atlanta' },
      { id: 'atx', name: 'FC', city: 'Austin' },
      { id: 'char', name: 'FC', city: 'Charlotte' },
      { id: 'chi', name: 'Fire', city: 'Chicago' },
      { id: 'cin', name: 'FC', city: 'Cincinnati' },
      { id: 'col', name: 'Rapids', city: 'Colorado' },
      { id: 'clb', name: 'Crew', city: 'Columbus' },
      { id: 'dc', name: 'United', city: 'DC' },
      { id: 'dal', name: 'FC', city: 'Dallas' },
      { id: 'hou', name: 'Dynamo', city: 'Houston' },
      { id: 'la', name: 'Galaxy', city: 'LA' },
      { id: 'lafc', name: 'FC', city: 'Los Angeles' },
      { id: 'mia', name: 'Inter', city: 'Miami' },
      { id: 'min', name: 'United', city: 'Minnesota' },
      { id: 'mtl', name: 'CF', city: 'Montreal' },
      { id: 'nsh', name: 'SC', city: 'Nashville' },
      { id: 'ne', name: 'Revolution', city: 'New England' },
      { id: 'nyc', name: 'FC', city: 'New York City' },
      { id: 'nyrb', name: 'Red Bulls', city: 'New York' },
      { id: 'orl', name: 'City', city: 'Orlando' },
      { id: 'phi', name: 'Union', city: 'Philadelphia' },
      { id: 'por', name: 'Timbers', city: 'Portland' },
      { id: 'rsl', name: 'Real', city: 'Salt Lake' },
      { id: 'sj', name: 'Earthquakes', city: 'San Jose' },
      { id: 'sea', name: 'Sounders', city: 'Seattle' },
      { id: 'stl', name: 'City SC', city: 'St. Louis' },
      { id: 'tor', name: 'FC', city: 'Toronto' },
      { id: 'van', name: 'Whitecaps', city: 'Vancouver' },
      { id: 'skc', name: 'Sporting', city: 'Kansas City' }
    ],
    epl: [
      { id: 'ars', name: 'Arsenal', city: '' },
      { id: 'avl', name: 'Aston Villa', city: '' },
      { id: 'bou', name: 'Bournemouth', city: '' },
      { id: 'bre', name: 'Brentford', city: '' },
      { id: 'bri', name: 'Brighton', city: '' },
      { id: 'che', name: 'Chelsea', city: '' },
      { id: 'cry', name: 'Crystal Palace', city: '' },
      { id: 'eve', name: 'Everton', city: '' },
      { id: 'ful', name: 'Fulham', city: '' },
      { id: 'liv', name: 'Liverpool', city: '' },
      { id: 'mci', name: 'Man City', city: '' },
      { id: 'mun', name: 'Man United', city: '' },
      { id: 'new', name: 'Newcastle', city: '' },
      { id: 'nfo', name: 'Nottingham Forest', city: '' },
      { id: 'sou', name: 'Southampton', city: '' },
      { id: 'tot', name: 'Tottenham', city: '' },
      { id: 'whu', name: 'West Ham', city: '' },
      { id: 'wol', name: 'Wolves', city: '' },
      { id: 'lei', name: 'Leicester', city: '' },
      { id: 'ips', name: 'Ipswich Town', city: '' }
    ],
    laliga: [
      { id: 'atm', name: 'Atletico Madrid', city: '' },
      { id: 'bar', name: 'Barcelona', city: '' },
      { id: 'ath', name: 'Athletic Bilbao', city: '' },
      { id: 'bet', name: 'Real Betis', city: '' },
      { id: 'cad', name: 'Cadiz', city: '' },
      { id: 'cel', name: 'Celta Vigo', city: '' },
      { id: 'get', name: 'Getafe', city: '' },
      { id: 'gir', name: 'Girona', city: '' },
      { id: 'gra', name: 'Granada', city: '' },
      { id: 'lpa', name: 'Las Palmas', city: '' },
      { id: 'mal', name: 'Mallorca', city: '' },
      { id: 'osa', name: 'Osasuna', city: '' },
      { id: 'ray', name: 'Rayo Vallecano', city: '' },
      { id: 'rma', name: 'Real Madrid', city: '' },
      { id: 'rso', name: 'Real Sociedad', city: '' },
      { id: 'sev', name: 'Sevilla', city: '' },
      { id: 'val', name: 'Valencia', city: '' },
      { id: 'vll', name: 'Valladolid', city: '' },
      { id: 'vil', name: 'Villarreal', city: '' },
      { id: 'alm', name: 'Almeria', city: '' }
    ],
    // NCAA Football - by conference
    'ncaa-fb-sec': [
      { id: 'ala', name: 'Crimson Tide', city: 'Alabama' },
      { id: 'ark', name: 'Razorbacks', city: 'Arkansas' },
      { id: 'aub', name: 'Tigers', city: 'Auburn' },
      { id: 'fla', name: 'Gators', city: 'Florida' },
      { id: 'uga', name: 'Bulldogs', city: 'Georgia' },
      { id: 'uk', name: 'Wildcats', city: 'Kentucky' },
      { id: 'lsu', name: 'Tigers', city: 'LSU' },
      { id: 'ole', name: 'Rebels', city: 'Ole Miss' },
      { id: 'msst', name: 'Bulldogs', city: 'Mississippi State' },
      { id: 'mizz', name: 'Tigers', city: 'Missouri' },
      { id: 'scar', name: 'Gamecocks', city: 'South Carolina' },
      { id: 'tenn', name: 'Volunteers', city: 'Tennessee' },
      { id: 'tex', name: 'Longhorns', city: 'Texas' },
      { id: 'texam', name: 'Aggies', city: 'Texas A&M' },
      { id: 'vandy', name: 'Commodores', city: 'Vanderbilt' },
      { id: 'okla', name: 'Sooners', city: 'Oklahoma' }
    ],
    'ncaa-fb-big10': [
      { id: 'ill', name: 'Fighting Illini', city: 'Illinois' },
      { id: 'ind', name: 'Hoosiers', city: 'Indiana' },
      { id: 'iowa', name: 'Hawkeyes', city: 'Iowa' },
      { id: 'mary', name: 'Terrapins', city: 'Maryland' },
      { id: 'mich', name: 'Wolverines', city: 'Michigan' },
      { id: 'msu', name: 'Spartans', city: 'Michigan State' },
      { id: 'minn', name: 'Golden Gophers', city: 'Minnesota' },
      { id: 'neb', name: 'Cornhuskers', city: 'Nebraska' },
      { id: 'nw', name: 'Wildcats', city: 'Northwestern' },
      { id: 'osu', name: 'Buckeyes', city: 'Ohio State' },
      { id: 'ore', name: 'Ducks', city: 'Oregon' },
      { id: 'psu', name: 'Nittany Lions', city: 'Penn State' },
      { id: 'rutg', name: 'Scarlet Knights', city: 'Rutgers' },
      { id: 'usc', name: 'Trojans', city: 'USC' },
      { id: 'ucla', name: 'Bruins', city: 'UCLA' },
      { id: 'wash', name: 'Huskies', city: 'Washington' },
      { id: 'wisc', name: 'Badgers', city: 'Wisconsin' },
      { id: 'pur', name: 'Boilermakers', city: 'Purdue' }
    ],
    'ncaa-fb-big12': [
      { id: 'asu', name: 'Sun Devils', city: 'Arizona State' },
      { id: 'ariz', name: 'Wildcats', city: 'Arizona' },
      { id: 'bay', name: 'Bears', city: 'Baylor' },
      { id: 'byu', name: 'Cougars', city: 'BYU' },
      { id: 'cin', name: 'Bearcats', city: 'Cincinnati' },
      { id: 'col', name: 'Buffaloes', city: 'Colorado' },
      { id: 'hou', name: 'Cougars', city: 'Houston' },
      { id: 'isu', name: 'Cyclones', city: 'Iowa State' },
      { id: 'kan', name: 'Jayhawks', city: 'Kansas' },
      { id: 'ksu', name: 'Wildcats', city: 'Kansas State' },
      { id: 'okst', name: 'Cowboys', city: 'Oklahoma State' },
      { id: 'tcu', name: 'Horned Frogs', city: 'TCU' },
      { id: 'ttu', name: 'Red Raiders', city: 'Texas Tech' },
      { id: 'ucf', name: 'Knights', city: 'UCF' },
      { id: 'utah', name: 'Utes', city: 'Utah' },
      { id: 'wvu', name: 'Mountaineers', city: 'West Virginia' }
    ],
    'ncaa-fb-acc': [
      { id: 'bc', name: 'Eagles', city: 'Boston College' },
      { id: 'clem', name: 'Tigers', city: 'Clemson' },
      { id: 'duke', name: 'Blue Devils', city: 'Duke' },
      { id: 'fsu', name: 'Seminoles', city: 'Florida State' },
      { id: 'gt', name: 'Yellow Jackets', city: 'Georgia Tech' },
      { id: 'lou', name: 'Cardinals', city: 'Louisville' },
      { id: 'mia', name: 'Hurricanes', city: 'Miami' },
      { id: 'unc', name: 'Tar Heels', city: 'North Carolina' },
      { id: 'ncst', name: 'Wolfpack', city: 'NC State' },
      { id: 'pitt', name: 'Panthers', city: 'Pittsburgh' },
      { id: 'smu', name: 'Mustangs', city: 'SMU' },
      { id: 'syr', name: 'Orange', city: 'Syracuse' },
      { id: 'vt', name: 'Hokies', city: 'Virginia Tech' },
      { id: 'uva', name: 'Cavaliers', city: 'Virginia' },
      { id: 'wake', name: 'Demon Deacons', city: 'Wake Forest' }
    ],
    'ncaa-fb-pac12': [
      { id: 'orst', name: 'Beavers', city: 'Oregon State' },
      { id: 'wsu', name: 'Cougars', city: 'Washington State' }
    ],
    // NCAA Basketball - by conference
    'ncaa-bb-sec': [
      { id: 'ala', name: 'Crimson Tide', city: 'Alabama' },
      { id: 'ark', name: 'Razorbacks', city: 'Arkansas' },
      { id: 'aub', name: 'Tigers', city: 'Auburn' },
      { id: 'fla', name: 'Gators', city: 'Florida' },
      { id: 'uga', name: 'Bulldogs', city: 'Georgia' },
      { id: 'uk', name: 'Wildcats', city: 'Kentucky' },
      { id: 'lsu', name: 'Tigers', city: 'LSU' },
      { id: 'ole', name: 'Rebels', city: 'Ole Miss' },
      { id: 'msst', name: 'Bulldogs', city: 'Mississippi State' },
      { id: 'mizz', name: 'Tigers', city: 'Missouri' },
      { id: 'scar', name: 'Gamecocks', city: 'South Carolina' },
      { id: 'tenn', name: 'Volunteers', city: 'Tennessee' },
      { id: 'tex', name: 'Longhorns', city: 'Texas' },
      { id: 'texam', name: 'Aggies', city: 'Texas A&M' },
      { id: 'vandy', name: 'Commodores', city: 'Vanderbilt' },
      { id: 'okla', name: 'Sooners', city: 'Oklahoma' }
    ],
    'ncaa-bb-big10': [
      { id: 'ill', name: 'Fighting Illini', city: 'Illinois' },
      { id: 'ind', name: 'Hoosiers', city: 'Indiana' },
      { id: 'iowa', name: 'Hawkeyes', city: 'Iowa' },
      { id: 'mary', name: 'Terrapins', city: 'Maryland' },
      { id: 'mich', name: 'Wolverines', city: 'Michigan' },
      { id: 'msu', name: 'Spartans', city: 'Michigan State' },
      { id: 'minn', name: 'Golden Gophers', city: 'Minnesota' },
      { id: 'neb', name: 'Cornhuskers', city: 'Nebraska' },
      { id: 'nw', name: 'Wildcats', city: 'Northwestern' },
      { id: 'osu', name: 'Buckeyes', city: 'Ohio State' },
      { id: 'ore', name: 'Ducks', city: 'Oregon' },
      { id: 'psu', name: 'Nittany Lions', city: 'Penn State' },
      { id: 'rutg', name: 'Scarlet Knights', city: 'Rutgers' },
      { id: 'usc', name: 'Trojans', city: 'USC' },
      { id: 'ucla', name: 'Bruins', city: 'UCLA' },
      { id: 'wash', name: 'Huskies', city: 'Washington' },
      { id: 'wisc', name: 'Badgers', city: 'Wisconsin' },
      { id: 'pur', name: 'Boilermakers', city: 'Purdue' }
    ],
    'ncaa-bb-big12': [
      { id: 'asu', name: 'Sun Devils', city: 'Arizona State' },
      { id: 'ariz', name: 'Wildcats', city: 'Arizona' },
      { id: 'bay', name: 'Bears', city: 'Baylor' },
      { id: 'byu', name: 'Cougars', city: 'BYU' },
      { id: 'cin', name: 'Bearcats', city: 'Cincinnati' },
      { id: 'col', name: 'Buffaloes', city: 'Colorado' },
      { id: 'hou', name: 'Cougars', city: 'Houston' },
      { id: 'isu', name: 'Cyclones', city: 'Iowa State' },
      { id: 'kan', name: 'Jayhawks', city: 'Kansas' },
      { id: 'ksu', name: 'Wildcats', city: 'Kansas State' },
      { id: 'okst', name: 'Cowboys', city: 'Oklahoma State' },
      { id: 'tcu', name: 'Horned Frogs', city: 'TCU' },
      { id: 'ttu', name: 'Red Raiders', city: 'Texas Tech' },
      { id: 'ucf', name: 'Knights', city: 'UCF' },
      { id: 'utah', name: 'Utes', city: 'Utah' },
      { id: 'wvu', name: 'Mountaineers', city: 'West Virginia' }
    ],
    'ncaa-bb-acc': [
      { id: 'bc', name: 'Eagles', city: 'Boston College' },
      { id: 'clem', name: 'Tigers', city: 'Clemson' },
      { id: 'duke', name: 'Blue Devils', city: 'Duke' },
      { id: 'fsu', name: 'Seminoles', city: 'Florida State' },
      { id: 'gt', name: 'Yellow Jackets', city: 'Georgia Tech' },
      { id: 'lou', name: 'Cardinals', city: 'Louisville' },
      { id: 'mia', name: 'Hurricanes', city: 'Miami' },
      { id: 'unc', name: 'Tar Heels', city: 'North Carolina' },
      { id: 'ncst', name: 'Wolfpack', city: 'NC State' },
      { id: 'pitt', name: 'Panthers', city: 'Pittsburgh' },
      { id: 'smu', name: 'Mustangs', city: 'SMU' },
      { id: 'syr', name: 'Orange', city: 'Syracuse' },
      { id: 'vt', name: 'Hokies', city: 'Virginia Tech' },
      { id: 'uva', name: 'Cavaliers', city: 'Virginia' },
      { id: 'wake', name: 'Demon Deacons', city: 'Wake Forest' },
      { id: 'nd', name: 'Fighting Irish', city: 'Notre Dame' }
    ],
    'ncaa-bb-pac12': [
      { id: 'orst', name: 'Beavers', city: 'Oregon State' },
      { id: 'wsu', name: 'Cougars', city: 'Washington State' }
    ],
    'ncaa-bb-big-east': [
      { id: 'but', name: 'Bulldogs', city: 'Butler' },
      { id: 'crei', name: 'Bluejays', city: 'Creighton' },
      { id: 'depa', name: 'Blue Demons', city: 'DePaul' },
      { id: 'gtwn', name: 'Hoyas', city: 'Georgetown' },
      { id: 'marq', name: 'Golden Eagles', city: 'Marquette' },
      { id: 'prov', name: 'Friars', city: 'Providence' },
      { id: 'sju', name: 'Red Storm', city: 'St. John\'s' },
      { id: 'seton', name: 'Pirates', city: 'Seton Hall' },
      { id: 'vill', name: 'Wildcats', city: 'Villanova' },
      { id: 'xav', name: 'Musketeers', city: 'Xavier' },
      { id: 'uconn', name: 'Huskies', city: 'UConn' }
    ],
    'ncaa-bb-aac': [
      { id: 'char', name: '49ers', city: 'Charlotte' },
      { id: 'ecu', name: 'Pirates', city: 'East Carolina' },
      { id: 'fau', name: 'Owls', city: 'Florida Atlantic' },
      { id: 'mem', name: 'Tigers', city: 'Memphis' },
      { id: 'navy', name: 'Midshipmen', city: 'Navy' },
      { id: 'unf', name: 'Mean Green', city: 'North Texas' },
      { id: 'rice', name: 'Owls', city: 'Rice' },
      { id: 'usf', name: 'Bulls', city: 'South Florida' },
      { id: 'smu', name: 'Mustangs', city: 'SMU' },
      { id: 'temp', name: 'Owls', city: 'Temple' },
      { id: 'tul', name: 'Golden Hurricane', city: 'Tulsa' },
      { id: 'tuls', name: 'Green Wave', city: 'Tulane' },
      { id: 'wich', name: 'Shockers', city: 'Wichita State' }
    ],
    'ncaa-bb-wcc': [
      { id: 'byu', name: 'Cougars', city: 'BYU' },
      { id: 'gonz', name: 'Bulldogs', city: 'Gonzaga' },
      { id: 'lmu', name: 'Lions', city: 'Loyola Marymount' },
      { id: 'pep', name: 'Waves', city: 'Pepperdine' },
      { id: 'port', name: 'Pilots', city: 'Portland' },
      { id: 'scla', name: 'Broncos', city: 'Santa Clara' },
      { id: 'sf', name: 'Dons', city: 'San Francisco' },
      { id: 'smc', name: 'Gaels', city: 'Saint Mary\'s' },
      { id: 'sd', name: 'Toreros', city: 'San Diego' },
      { id: 'pac', name: 'Tigers', city: 'Pacific' }
    ],
    'ncaa-bb-a10': [
      { id: 'day', name: 'Flyers', city: 'Dayton' },
      { id: 'duq', name: 'Dukes', city: 'Duquesne' },
      { id: 'ford', name: 'Rams', city: 'Fordham' },
      { id: 'gw', name: 'Revolutionaries', city: 'George Washington' },
      { id: 'gmas', name: 'Patriots', city: 'George Mason' },
      { id: 'lasalle', name: 'Explorers', city: 'La Salle' },
      { id: 'loy', name: 'Greyhounds', city: 'Loyola Chicago' },
      { id: 'mass', name: 'Minutemen', city: 'UMass' },
      { id: 'rich', name: 'Spiders', city: 'Richmond' },
      { id: 'rhode', name: 'Rams', city: 'Rhode Island' },
      { id: 'slu', name: 'Billikens', city: 'Saint Louis' },
      { id: 'sbona', name: 'Bonnies', city: 'St. Bonaventure' },
      { id: 'sjoe', name: 'Hawks', city: 'Saint Joseph\'s' },
      { id: 'vcu', name: 'Rams', city: 'VCU' },
      { id: 'davi', name: 'Flyers', city: 'Davidson' }
    ],
    'ncaa-bb-mw': [
      { id: 'afb', name: 'Falcons', city: 'Air Force' },
      { id: 'boise', name: 'Broncos', city: 'Boise State' },
      { id: 'csu', name: 'Rams', city: 'Colorado State' },
      { id: 'fres', name: 'Bulldogs', city: 'Fresno State' },
      { id: 'nev', name: 'Wolf Pack', city: 'Nevada' },
      { id: 'nm', name: 'Lobos', city: 'New Mexico' },
      { id: 'sdsu', name: 'Aztecs', city: 'San Diego State' },
      { id: 'sjsu', name: 'Spartans', city: 'San Jose State' },
      { id: 'unlv', name: 'Rebels', city: 'UNLV' },
      { id: 'utah', name: 'Aggies', city: 'Utah State' },
      { id: 'wyo', name: 'Cowboys', city: 'Wyoming' }
    ],
    'ncaa-fb-aac': [],
    'ncaa-fb-mw': [],
    'ncaa-fb-sunbelt': [],
    'ncaa-fb-mac': [],
    'ncaa-fb-cusa': [],
    'milb': []
  };

  ngOnInit() {
    this.loadFavorites();
    if (this.favoriteTeams.length > 0) {
      this.currentStep = 'scores';
      this.loadScores();
    }
  }

  selectSport(sportId: string) {
    this.selectedSport = sportId;
    this.currentStep = 'league';
  }

  selectLeague(leagueId: string) {
    this.selectedLeague = leagueId;

    // Check if this league has conferences
    if (this.conferences[leagueId]) {
      this.currentStep = 'conference';
    } else {
      this.currentStep = 'team';
    }
  }

  selectConference(conferenceId: string) {
    this.selectedConference = conferenceId;
    this.currentStep = 'team';
  }

  toggleTeam(team: { id: string; name: string; city: string }) {
    const existingIndex = this.favoriteTeams.findIndex(t => t.id === team.id);

    if (existingIndex > -1) {
      // Remove team
      this.favoriteTeams.splice(existingIndex, 1);
    } else {
      // Add team
      const favoriteTeam: Team = {
        id: team.id,
        name: `${team.city} ${team.name}`,
        sport: this.selectedSport,
        league: this.selectedLeague
      };
      this.favoriteTeams.push(favoriteTeam);
    }

    this.saveFavorites();
    this.loadScores();
  }

  isTeamSelected(teamId: string): boolean {
    return this.favoriteTeams.some(t => t.id === teamId);
  }

  addAnotherTeam() {
    this.currentStep = 'sport';
    this.selectedSport = '';
    this.selectedLeague = '';
    this.selectedConference = '';
  }

  closeSelection() {
    this.currentStep = 'scores';
    this.selectedSport = '';
    this.selectedLeague = '';
    this.selectedConference = '';
  }

  backToSport() {
    this.currentStep = 'sport';
    this.selectedLeague = '';
  }

  backToLeague() {
    this.currentStep = 'league';
    this.selectedConference = '';
  }

  backToConference() {
    this.currentStep = 'conference';
  }

  loadScores() {
    if (this.favoriteTeams.length === 0) {
      this.games = [];
      return;
    }

    // Get unique leagues from favorite teams
    const uniqueLeagues = [...new Set(this.favoriteTeams.map(t => t.league))];

    // Fetch scoreboards for all leagues
    const requests = uniqueLeagues.map(league =>
      this.sportsService.getScoreboard(league)
    );

    forkJoin(requests).subscribe({
      next: (scoreboards) => {
        this.games = [];

        // Process each scoreboard
        scoreboards.forEach((scoreboard, index) => {
          const league = uniqueLeagues[index];

          scoreboard.events.forEach((event: any) => {
            const competition = event.competitions[0];
            if (!competition) return;

            const homeTeam = competition.competitors.find((c: any) => c.homeAway === 'home');
            const awayTeam = competition.competitors.find((c: any) => c.homeAway === 'away');

            if (!homeTeam || !awayTeam) return;

            // Check if any of our favorite teams is playing
            const isFavoriteGame = this.favoriteTeams.some(fav =>
              fav.league === league && (
                homeTeam.team.displayName.includes(fav.name) ||
                awayTeam.team.displayName.includes(fav.name) ||
                fav.name.includes(homeTeam.team.shortDisplayName) ||
                fav.name.includes(awayTeam.team.shortDisplayName)
              )
            );

            if (isFavoriteGame) {
              const status = competition.status.type;
              let gameStatus = 'scheduled';
              if (status.state === 'post') gameStatus = 'final';
              if (status.state === 'in') gameStatus = 'live';

              this.games.push({
                homeTeam: homeTeam.team.shortDisplayName,
                awayTeam: awayTeam.team.shortDisplayName,
                homeScore: parseInt(homeTeam.score) || 0,
                awayScore: parseInt(awayTeam.score) || 0,
                status: gameStatus,
                time: gameStatus === 'live' ? status.detail : undefined
              });
            }
          });
        });

        // If no games found, show a message
        if (this.games.length === 0) {
          console.log('No games found for your favorite teams today');
        }
      },
      error: (err) => {
        console.error('Error loading scores:', err);
        // Fallback to empty games
        this.games = [];
      }
    });
  }

  private loadFavorites() {
    const saved = localStorage.getItem('dashboard_favorite_teams');
    if (saved) {
      this.favoriteTeams = JSON.parse(saved);
    }
  }

  private saveFavorites() {
    localStorage.setItem('dashboard_favorite_teams', JSON.stringify(this.favoriteTeams));
  }

  get availableLeagues() {
    return this.leagues[this.selectedSport] || [];
  }

  get availableConferences() {
    return this.conferences[this.selectedLeague] || [];
  }

  get availableTeams() {
    // If conference is selected, get teams from that conference
    if (this.selectedConference) {
      const conferenceKey = `${this.selectedLeague}-${this.selectedConference}`;
      return this.teams[conferenceKey] || [];
    }
    return this.teams[this.selectedLeague] || [];
  }
}
