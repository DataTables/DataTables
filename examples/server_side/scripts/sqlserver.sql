--
-- DataTables Ajax and server-side processing database (SQL Server)
--
IF OBJECT_ID('datatables_demo', 'U') IS NOT NULL
  DROP TABLE datatables_demo;

CREATE TABLE datatables_demo (
	id         int NOT NULL identity,
	first_name varchar(250) NOT NULL default '',
	last_name  varchar(250) NOT NULL default '',
	position   varchar(250) NOT NULL default '',
	email      varchar(250) NOT NULL default '',
	office     varchar(250) NOT NULL default '',
	start_date datetime default NULL,
	age        int,
	salary     int,
	seq        int,
	extn       varchar(8) NOT NULL default '',
	PRIMARY KEY (id)
);

SET IDENTITY_INSERT datatables_demo ON;

INSERT INTO datatables_demo
		( id, first_name, last_name, age, position, salary, start_date, extn, email, office, seq ) 
	VALUES
		( 1, 'Tiger', 'Nixon', 61, 'System Architect', 320800, '20110425', 5421, 't.nixon@datatables.net', 'Edinburgh', 2 ),
		( 2, 'Garrett', 'Winters', 63, 'Accountant', 170750, '20110725', 8422, 'g.winters@datatables.net', 'Tokyo', 22 ),
		( 3, 'Ashton', 'Cox', 66, 'Junior Technical Author', 86000, '20090112', 1562, 'a.cox@datatables.net', 'San Francisco', 6 ),
		( 4, 'Cedric', 'Kelly', 22, 'Senior Javascript Developer', 433060, '20120329', 6224, 'c.kelly@datatables.net', 'Edinburgh', 41 ),
		( 5, 'Airi', 'Satou', 33, 'Accountant', 162700, '20081128', 5407, 'a.satou@datatables.net', 'Tokyo', 55 ),
		( 6, 'Brielle', 'Williamson', 61, 'Integration Specialist', 372000, '20121202', 4804, 'b.williamson@datatables.net', 'New York', 21 ),
		( 7, 'Herrod', 'Chandler', 59, 'Sales Assistant', 137500, '20120806', 9608, 'h.chandler@datatables.net', 'San Francisco', 46 ),
		( 8, 'Rhona', 'Davidson', 55, 'Integration Specialist', 327900, '20101014', 6200, 'r.davidson@datatables.net', 'Tokyo', 50 ),
		( 9, 'Colleen', 'Hurst', 39, 'Javascript Developer', 205500, '20090915', 2360, 'c.hurst@datatables.net', 'San Francisco', 26 ),
		( 10, 'Sonya', 'Frost', 23, 'Software Engineer', 103600, '20081213', 1667, 's.frost@datatables.net', 'Edinburgh', 18 ),
		( 11, 'Jena', 'Gaines', 30, 'Office Manager', 90560, '20081219', 3814, 'j.gaines@datatables.net', 'London', 13 ),
		( 12, 'Quinn', 'Flynn', 22, 'Support Lead', 342000, '20130303', 9497, 'q.flynn@datatables.net', 'Edinburgh', 23 ),
		( 13, 'Charde', 'Marshall', 36, 'Regional Director', 470600, '20081016', 6741, 'c.marshall@datatables.net', 'San Francisco', 14 ),
		( 14, 'Haley', 'Kennedy', 43, 'Senior Marketing Designer', 313500, '20121218', 3597, 'h.kennedy@datatables.net', 'London', 12 ),
		( 15, 'Tatyana', 'Fitzpatrick', 19, 'Regional Director', 385750, '20100317', 1965, 't.fitzpatrick@datatables.net', 'London', 54 ),
		( 16, 'Michael', 'Silva', 66, 'Marketing Designer', 198500, '20121127', 1581, 'm.silva@datatables.net', 'London', 37 ),
		( 17, 'Paul', 'Byrd', 64, 'Chief Financial Officer (CFO)', 725000, '20100609', 3059, 'p.byrd@datatables.net', 'New York', 32 ),
		( 18, 'Gloria', 'Little', 59, 'Systems Administrator', 237500, '20090410', 1721, 'g.little@datatables.net', 'New York', 35 ),
		( 19, 'Bradley', 'Greer', 41, 'Software Engineer', 132000, '20121013', 2558, 'b.greer@datatables.net', 'London', 48 ),
		( 20, 'Dai', 'Rios', 35, 'Personnel Lead', 217500, '20120926', 2290, 'd.rios@datatables.net', 'Edinburgh', 45 ),
		( 21, 'Jenette', 'Caldwell', 30, 'Development Lead', 345000, '20110903', 1937, 'j.caldwell@datatables.net', 'New York', 17 ),
		( 22, 'Yuri', 'Berry', 40, 'Chief Marketing Officer (CMO)', 675000, '20090625', 6154, 'y.berry@datatables.net', 'New York', 57 ),
		( 23, 'Caesar', 'Vance', 21, 'Pre-Sales Support', 106450, '20111212', 8330, 'c.vance@datatables.net', 'New York', 29 ),
		( 24, 'Doris', 'Wilder', 23, 'Sales Assistant', 85600, '20100920', 3023, 'd.wilder@datatables.net', 'Sydney', 56 ),
		( 25, 'Angelica', 'Ramos', 47, 'Chief Executive Officer (CEO)', 1200000, '20091009', 5797, 'a.ramos@datatables.net', 'London', 36 ),
		( 26, 'Gavin', 'Joyce', 42, 'Developer', 92575, '20101222', 8822, 'g.joyce@datatables.net', 'Edinburgh', 5 ),
		( 27, 'Jennifer', 'Chang', 28, 'Regional Director', 357650, '20101114', 9239, 'j.chang@datatables.net', 'Singapore', 51 ),
		( 28, 'Brenden', 'Wagner', 28, 'Software Engineer', 206850, '20110607', 1314, 'b.wagner@datatables.net', 'San Francisco', 20 ),
		( 29, 'Fiona', 'Green', 48, 'Chief Operating Officer (COO)', 850000, '20100311', 2947, 'f.green@datatables.net', 'San Francisco', 7 ),
		( 30, 'Shou', 'Itou', 20, 'Regional Marketing', 163000, '20110814', 8899, 's.itou@datatables.net', 'Tokyo', 1 ),
		( 31, 'Michelle', 'House', 37, 'Integration Specialist', 95400, '20110602', 2769, 'm.house@datatables.net', 'Sydney', 39 ),
		( 32, 'Suki', 'Burks', 53, 'Developer', 114500, '20091022', 6832, 's.burks@datatables.net', 'London', 40 ),
		( 33, 'Prescott', 'Bartlett', 27, 'Technical Author', 145000, '20110507', 3606, 'p.bartlett@datatables.net', 'London', 47 ),
		( 34, 'Gavin', 'Cortez', 22, 'Team Leader', 235500, '20081026', 2860, 'g.cortez@datatables.net', 'San Francisco', 52 ),
		( 35, 'Martena', 'Mccray', 46, 'Post-Sales support', 324050, '20110309', 8240, 'm.mccray@datatables.net', 'Edinburgh', 8 ),
		( 36, 'Unity', 'Butler', 47, 'Marketing Designer', 85675, '20091209', 5384, 'u.butler@datatables.net', 'San Francisco', 24 ),
		( 37, 'Howard', 'Hatfield', 51, 'Office Manager', 164500, '20081216', 7031, 'h.hatfield@datatables.net', 'San Francisco', 38 ),
		( 38, 'Hope', 'Fuentes', 41, 'Secretary', 109850, '20100212', 6318, 'h.fuentes@datatables.net', 'San Francisco', 53 ),
		( 39, 'Vivian', 'Harrell', 62, 'Financial Controller', 452500, '20090214', 9422, 'v.harrell@datatables.net', 'San Francisco', 30 ),
		( 40, 'Timothy', 'Mooney', 37, 'Office Manager', 136200, '20081211', 7580, 't.mooney@datatables.net', 'London', 28 ),
		( 41, 'Jackson', 'Bradshaw', 65, 'Director', 645750, '20080926', 1042, 'j.bradshaw@datatables.net', 'New York', 34 ),
		( 42, 'Olivia', 'Liang', 64, 'Support Engineer', 234500, '20110203', 2120, 'o.liang@datatables.net', 'Singapore', 4 ),
		( 43, 'Bruno', 'Nash', 38, 'Software Engineer', 163500, '20110503', 6222, 'b.nash@datatables.net', 'London', 3 ),
		( 44, 'Sakura', 'Yamamoto', 37, 'Support Engineer', 139575, '20090819', 9383, 's.yamamoto@datatables.net', 'Tokyo', 31 ),
		( 45, 'Thor', 'Walton', 61, 'Developer', 98540, '20130811', 8327, 't.walton@datatables.net', 'New York', 11 ),
		( 46, 'Finn', 'Camacho', 47, 'Support Engineer', 87500, '20090707', 2927, 'f.camacho@datatables.net', 'San Francisco', 10 ),
		( 47, 'Serge', 'Baldwin', 64, 'Data Coordinator', 138575, '20120409', 8352, 's.baldwin@datatables.net', 'Singapore', 44 ),
		( 48, 'Zenaida', 'Frank', 63, 'Software Engineer', 125250, '20100104', 7439, 'z.frank@datatables.net', 'New York', 42 ),
		( 49, 'Zorita', 'Serrano', 56, 'Software Engineer', 115000, '20120601', 4389, 'z.serrano@datatables.net', 'San Francisco', 27 ),
		( 50, 'Jennifer', 'Acosta', 43, 'Junior Javascript Developer', 75650, '20130201', 3431, 'j.acosta@datatables.net', 'Edinburgh', 49 ),
		( 51, 'Cara', 'Stevens', 46, 'Sales Assistant', 145600, '20111206', 3990, 'c.stevens@datatables.net', 'New York', 15 ),
		( 52, 'Hermione', 'Butler', 47, 'Regional Director', 356250, '20110321', 1016, 'h.butler@datatables.net', 'London', 9 ),
		( 53, 'Lael', 'Greer', 21, 'Systems Administrator', 103500, '20090227', 6733, 'l.greer@datatables.net', 'London', 25 ),
		( 54, 'Jonas', 'Alexander', 30, 'Developer', 86500, '20100714', 8196, 'j.alexander@datatables.net', 'San Francisco', 33 ),
		( 55, 'Shad', 'Decker', 51, 'Regional Director', 183000, '20081113', 6373, 's.decker@datatables.net', 'Edinburgh', 43 ),
		( 56, 'Michael', 'Bruce', 29, 'Javascript Developer', 183000, '20110627', 5384, 'm.bruce@datatables.net', 'Singapore', 16 ),
		( 57, 'Donna', 'Snider', 27, 'Customer Support', 112000, '20110125', 4226, 'd.snider@datatables.net', 'New York', 19 );

	SET IDENTITY_INSERT datatables_demo OFF;