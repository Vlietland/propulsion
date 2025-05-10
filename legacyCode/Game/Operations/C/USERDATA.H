/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:	Beheert de userdata 	(userdata.h)	       */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   Deze h-file bevat de header voor de class userdata		       */
/*   Hierin wordt het volgende bij gehouden			       */
/*   * de score                                                        */
/*   * de ruimteschepen die de speler nog credit heeft		       */
/*   * het level waarin de speler zich bevindt			       */
/*								       */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  2 februari 1997                             */
/*=====================================================================*/

#if !defined( _userdata_h_)
#define _userdata_h_



class Userdata
{
 public:
   void       inituserdata(int newscore, int newships, int newlevel);
   gamestatus updateuserdata();
   void	      drawuserdata();
   int        getscore()  {return (score);}
   int        getships()  {return (ships);}
   int        getlevel()  {return (level);}

 private:
   void levelsuccess();
   void reactorcheck();
   int score;
   int ships;
   int level;
   gamestatus playstatus;
};

#endif  _userdata_h_