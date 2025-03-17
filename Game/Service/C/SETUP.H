/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Playgamemanager definitie     (playgame.h)     */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   In deze file staat de definitie van de klasse playgame	       */
/*   Deze klasse bestaat vooral uit het managen (in goede volgorde     */
/*   aflopen) van de basisklassen.                                     */
/*                                                                     */
/*                                                                     */
/*                                                                     */
/* DATUM:                  12 maart 1997                               */
/*=====================================================================*/

#if !defined( _setup_h_)
#define _setup_h_

struct game   {int level, ships, fuel, score;
	       vector shipposition;};



class Setupman
  {
   public:
     void initgame();
     void loadgame();
     void restartgame();
     void shipgoneinitgame();
     void nextlevelinitgame();
     void savegame();
     void restoregame();

   private:
     game start;

  };

#endif  _setup_h_