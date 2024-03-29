import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import createIndexStore, {
  IndexState,
} from './../../../view/index/stores/index';
import DIContainerTypes from '../../DIContainer.types';
import TeamsService from '../../application/interface/TeamsService';
import Team from '../../domain/model/Teams/Team';
import IndexMainComponent from '../../../view/index/component/IndexMainComponent';
import { View } from '../../../view/common/View';
import GamesService from '../../application/interface/GamesService';
import Game from '../../domain/model/Games/Game';

@injectable()
export default class IndexController {
  constructor(
    @inject(DIContainerTypes.GamesService)
    private readonly gamesService: GamesService,
    @inject(DIContainerTypes.TeamsService)
    private readonly teamsService: TeamsService
  ) {}

  public async get() {
    // TODO: ログインされたチームのIDを取得するようにする。
    const loggedInTeamId = 1;
    const fetchGames = this.gamesService.getGamesByTeamId(loggedInTeamId, 0, 3);
    const fetchTeams = this.teamsService.getTeams(0, 3);
    const [games, teams] = await Promise.all([fetchGames, fetchTeams]);
    // TODO とりあえず投げるけど、本来ならトルツメがよさそう。
    if (teams instanceof Error) {
      console.warn(teams.message);
      throw teams;
    }
    if (games instanceof Error) {
      throw games;
    }
    const state = this.createState(games, teams);
    const store = createIndexStore(state);
    return new View({
      pageName: 'index',
      title: 'BMW - 野球スコア管理ツール',
      content: IndexMainComponent,
      state,
      store,
    });
  }

  private createState(
    gameList: ReadonlyArray<Game>,
    teamList: ReadonlyArray<Team>
  ): IndexState {
    return {
      latestGames: {
        games: gameList.map((game) => ({
          gameId: game.getGameId(),
          firstTeam: {
            teamId: game.getFirstTeam().getTeamId(),
            teamName: game.getFirstTeam().getTeamName(),
          },
          firstTeamScore: game.getBattedFirstTeamScore(),
          secondTeam: {
            teamId: game.getSecondTeam().getTeamId(),
            teamName: game.getSecondTeam().getTeamName(),
          },
          secondTeamScore: game.getFieldFirstTeamScore(),
        })),
      },
      frequentBattledTeams: {
        teams: teamList.map((team) => ({
          teamId: team.getTeamId(),
          teamName: team.getTeamName(),
        })),
      },
    };
  }
}
