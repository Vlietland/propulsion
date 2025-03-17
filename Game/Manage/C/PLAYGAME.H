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

#if !defined( _playgame_h_)
#define _playgame_h_



class Playgameman
  {
   public:
     gamestatus playgame(gamestatus);

   private:
     void preparegame();
     void drawgame();
     void startgame();
     void manageenemy();
     void managecore();
     void manageshipball();

     gamestatus keuze;
  };

#endif  _playgame_h_