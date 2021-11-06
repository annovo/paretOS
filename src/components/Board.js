import { useState } from "react";
import { I18n } from "@aws-amplify/core";
import Table from "react-bootstrap/lib/Table";
/**
 * @class Leaderboard
 * @TODO Issue #75
 * @desc Compares the score property of each user object and displays in an interactive table
 * @param {Prop} users-an array of objects with name and score properties
 * @param {Prop} itemsPerPage-integer to determine how many users to display on each page
 * @param {Prop} currentUser-currently logged in user
 * @param {Prop} history-array of recent pages/views visited
 */

function Leaderboard({ users, itemsPerPage, currentUser, history }) {

  const sortedUsers = users.sort((a, b) => a.score - b.score);
  const initialRanks = sortedUsers.map((user, i) => {
    user.page = getPage(i + 1); 
    user.rank = i > 0 && user.score == sortedUsers[i - 1].score ? sortedUsers[i - 1].rank : i + 1; 
    return user;
  });
  const currentPage = 1;
  const maxPages = getPage(users.length);

  const [ranking, setRanking] = useState(initialRanks);
  const [asc, setAsc] = useState(false);
  const [pages, setPages] = useState({ currentPage, maxPages });

  /**
   * @function sortUsersByScore
   * @desc Sorts the ranking by score either ascending or descending
   */
  function sortUsersByScore() {
    const tempRanking = [...ranking].sort((a,b) => a.score - b.score);
    if (asc) {
      const newRanking = tempRanking.reverse().map(addPage);
      setAsc(false);
      setRanking(newRanking);
    }
    else {
      const newRanking = tempRanking.map(addPage);
      setAsc(true);
      setRanking(newRanking);
    }
  };

  /**
   * @function filterRank
   * @desc Filters through the ranking to find matches and sorts all matches by score
   * @param {String} search input
   */   
   function filterRank(e) {
      const inputLength = e.target.value.length;
      const filteredRanking = [];
      if (inputLength > 0) {
        users.forEach(user => {
          const str = user.fName.substr(0,inputLength).toLowerCase();
          if (str === e.target.value.toLowerCase()) {
            filteredRanking.push(user);
          }
        });
        filteredRanking.sort((a,b) => asc ? a.score - b.score : b.score - a.score);
        const newRanking = filteredRanking.map(addPage);
        const [currentPage, maxPages] = [1, getPage(newRanking.length)];
        setRanking(newRanking);
        setPages({ currentPage, maxPages });
      }
      else {
        const newRanking = users.map(addPage);
        setRanking(newRanking);
        setPages({ currentPage: 1, maxPages: getPage(users.length) })
      }
   }

  /**
   * @function increasePage
   * @desc Increments page by one
   * @param {Event} Click
   */
  function increasePage(e) {
    let { currentPage, maxPages } = pages;
    if (currentPage < maxPages) { 
      currentPage += 1; 
      setPages({ currentPage, maxPages });
    }
  }

  /**
   * @function decreasePage
   * @desc Decrements page by one
   * @param {Event} Click
   */
  function decreasePage(e) {
    let { currentPage, maxPages } = pages;
    if (currentPage > 1) { 
      currentPage -= 1; 
      setPages({ currentPage, maxPages });
    }
  }

  /**
   * @function getPage
   * @desc Gets the page number of an item based on items per page
   * @param itemNumber - number of the item to get the page of
   */
  function getPage(itemNumber) {
    return Math.ceil(itemNumber / itemsPerPage);
  }  

  /**
   * @function addPage
   * @desc Gets the page number of an item based on items per page
   * @param user - the user object
   * @param index - the index in the array
   */
  function addPage(user, index) {
     user.page = getPage(index + 1);
     return user;
  }  

  return (
      <div style={{ margin: '25px' }}>
      <h2>{I18n.get("leaderboard")}</h2>
      <form onChange={filterRank} style={{ paddingBottom: '10px' }}>
        <input className="form-control" type="search" name="search" placeholder="Filter by name..." />
      </form>
      <Table bordered condensed hover responsive>
        <tbody>
          <tr>
            <td className="rank-header text-center" onClick={sortUsersByScore}>
              {" "}
              {I18n.get("rank")}{" "}
            </td>
            <td className="rank-header" onClick={sortUsersByScore}>
              {" "}
              {I18n.get("name")}{" "}
            </td>
            <td className="rank-header text-center" onClick={sortUsersByScore}>
              {" "}
              {I18n.get("score")}{" "}
            </td>
          </tr>
          { ranking.map((user, i) => user.page === pages.currentPage ? 
            (
              <tr
                className={currentUser.id === user.id ? "my-rank" : ""}
                key={i}
              >
                <td className="data text-center">{i > 0 && user.rank == ranking[i - 1].rank ? '-' : user.rank}</td>
                <td
                  onClick={() =>
                    history.push(`/profile/${user.id}`)
                  }
                  className="data2"
                >
                  {user.fName} {user.lName.substr(0,1).toUpperCase()}.
                </td>
                <td className="data text-center">{user.score} pts</td>  
              </tr>
            ) : null 
          )}
        </tbody>
      </Table>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {pages.currentPage <= 1 ? null : (
          <p className="decrement" onClick={decreasePage}>
            {I18n.get("back")}
          </p>
        )}
        {pages.currentPage <= 1 ? null : (
          <p onClick={decreasePage}> {pages.currentPage - 1}</p>
        )}
        {pages.maxPages == 1 ? null : <p> {pages.currentPage}</p>}
        {pages.currentPage < pages.maxPages ? (
          <p onClick={increasePage}> {pages.currentPage + 1}</p>
        ) : null}
        {pages.currentPage < pages.maxPages ? (
          <p className="increment" onClick={increasePage}>
            {I18n.get("next")}
          </p>
        ) : null }
      </div>
    </div>
  );
}

export default Leaderboard;
