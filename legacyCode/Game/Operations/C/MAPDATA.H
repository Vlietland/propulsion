/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:	Beheert de mapdata    (mapdata.h)              */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   Deze h-file bevat de header voor de class mapdata                 */
/*   Hierin wordt het complete veld bijgehouden                        */
/*								       */
/*                                                                     */
/*								       */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  12 maart 1997                               */
/*=====================================================================*/

#if !defined( _mapdata_h_)
#define _mapdata_h_


struct reactorinfo
	 {
	  unsigned char    blowtime; // gemakkelijker bij te houden dan in de map
	  unsigned char    damage;
	 };


struct shift
         {
          state3           ScrX;
          state3           ScrY;
         };

class Mapdata
  {
   public:
     void          initmap();
     void          updatemap();
     shieldcapture checkshieldcapture();
     kogelhit      checkshipkogelposition(vector kogelposition);
     void          getenemyexplosionstatus();
     void          getreactorstatus();
     void          updatebackground();

     intvec  getbasismapposition() {return(basismapposition);};
     vector  getmapballposition();
     char    getmappiece(intvec mapcoor) {return(mapdata[mapcoor.Sx][mapcoor.Sy].soort);};


   private:
     // .hft
     void          drawbackground();
     void          drawshiftbackground();
     void          updatescreenshift();
     void          updatemapblocks();

     shieldcapture checkballreach();
     void          backgroundupdaterequest(vector kogelposition); // zorgt voor het opnieuw tekenen van de geraakte blokken

     // .hf2
     void          updatemapblock(intvec mapcoor, char mapsoort);

     void          updatemapball(intvec mapcoor, char mapsoort);
     void          updateturret(intvec mapcoor, char mapsoort);
     void          updateturret2(intvec mapcoor, char mapsoort);
     void          updatereactor(intvec mapcoor, char mapsoort);
     void          updatereactorstatus();
     void          updatefueltank(intvec mapcoor, char mapsoort);
     void          updateenergypod(intvec mapcoor, char mapsoort);
     void          updatecity(intvec mapcoor, char mapsoort);
     void          updatebutton(intvec mapcoor, char mapsoort);
     void          updatestar(intvec mapcoor, char mapsoort);
     void          updatelaser(intvec mapcoor, char mapsoort);
     void          checkexplosion(intvec mapcoor);
     //. hf3

     void          setupdaterequest(intvec mapcoor);
     void          setlongupdaterequest(intvec mapcoor);
     void          openlaser(intvec mapcoor);
     void          closelaser(intvec mapcoor);
     int           checkmapcoor(intvec mapcoor);

     mappiece	   mapdata[maplengte][maphoogte];
     reactorinfo   reactorstatus;
     vector	   mapballposition;
     intvec	   basismapposition, basismapcoor, poscoormod, checkcoor;
     shift         shiftscreen;                                   // houdt het schuiven van het scherm bij
     bool          drawonetime;                                   // zorgt voor een geforceerde backgrounddraw
};


class Builddata
  {
   friend Mapdata;

   private:
     bouwsteen    blok[soorten];
  };

#endif  _mapdata_h_