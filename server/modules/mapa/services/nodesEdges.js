const {getDistanceBetweenPoints} = require('@mapa/helpers.js')


const todasLasPlantas = {}

const nodosPlanta5=[
    //laboratorios
{ id: 'B_150_L1', latlng: [637.971925, 631.903809], name: 'Lab de metrología dimensional' },
{ id: 'B_150_L2', latlng: [656.849027, 587.278809], name: 'Lab de fabricación ensamblaje y ensayo de conjuntos mecánicos' },
{ id: 'A_146', latlng: [573.489507, 637.048828], name: 'Ormazabal' },
{ id: 'A_146_L', latlng: [572.820976, 556.239746], name: 'Lab de alta tensión' },
{ id: 'A_144_L1', latlng: [520.726778, 653.275879], name: 'Lab de máquinas eléctricas II' },
{ id: 'A_144_L2', latlng: [536.811088, 610.832031],  name: 'Lab de máquinas eléctricas II' },
{ id: 'A_138_L', latlng: [430.220015, 715.640625],  name: 'Lab de prototipado electrónico' },
{ id: 'A_140_L1', latlng: [481.862663, 661.858887],  name: 'Lab de ensayos de polímeros' },
{ id: 'A_240_L2', latlng: [468.299629, 589.759766],  name: 'Lab de transformación de polímeros' },
{ id: 'A_137_L', latlng: [434.74629, 698.173828], name: 'Lab de medios comtinuos' },
{ id: 'A_134_L', latlng: [409.967761, 697.140625],  name: 'Lab de ing. térmica' },
{ id: 'A_133_L', latlng: [362.340726, 696.889648],  name: 'Lab de máquina herramienta y soldadura' },
{ id: 'A_132_L', latlng: [328.777285, 711.959229],  name: 'Lab de investigación LIMIT' },
{ id: 'A_131_L1', latlng: [308.92815, 684.136719],  name: 'Lab de proyectos 1' },
{ id: 'A_131_L2', latlng: [308.752243, 538.386719],  name: 'Lab de mecatrónica' },
{ id: 'A_125_L', latlng: [218.820166, 728.90625],  name: 'Lab de óptica' },
{ id: 'A_113_L', latlng: [162.720758, 707.277588],  name: 'Lab de coworking' },
{ id: 'A_111_L', latlng: [184.813261, 611.6875],  name: 'Lab de idiomas' },


//despachos
{ id: 'B_150_1', latlng: [651.84847, 649.028809], name: 'Despacho B 150-1' },
{ id: 'B_150_2', latlng: [664.372325, 631.839355], name: 'Despacho B 150-2' },
{ id: 'B_150b', latlng: [664.372325, 613.464355], name: 'Despacho B 150b' },
{ id: 'B_148', latlng: [651.42291, 696.436035],  name: 'Despacho de ing. mecánica y construcción' },
{ id: 'A_140', latlng: [464.219814, 686.217773], name: 'Despacho A -140' },
{ id: 'A_108', latlng: [185.563344, 510.6875],  name: 'Despacho A -108' },
{ id: 'A_105', latlng: [181.026707, 421.788086],  name: 'Despacho A -105' },


// //Aulas
{ id: 'taller2', latlng: [582.615523, 688.173828],  name: 'Taller 2' },
{ id: 'taller1', latlng: [561.613185, 688.923828], name: 'Taller 1' },
{ id: 'taller', latlng: [535.560949, 567.707031],  name: 'Taller' },
{ id: 'A_140_A', latlng: [451.234253, 661.233887],  name: 'Aula de tecnología de polímeros' },
{ id: 'A_129_S1', latlng: [324.054834, 685.761719],  name: 'Sala 1' },
{ id: 'A_129_S2', latlng: [293.551438, 686.136719], name: 'Sala 2' },
{ id: 'A_109_S', latlng: [183.81315, 556.4375],  name: 'Sala roja' },
{ id: 'A_106_S', latlng: [185.27718, 473.038086],  name: 'Sala azul' },

// //Otros
{ id: 'A_139', latlng: [448.22202, 715.640625],  name: 'MotoStudent' },
{ id: 'almacen_de_zinico', latlng: [171.248274, 327.507813],  name: 'Almacén de zinico' },
{ id: 'club_deportivo', latlng: [270.899217, 745.759766],  name: 'Club deportivo' },


// //Nodos

{ id: 'nodo_exterior_medio_pisoBAJO', latlng: [271.790185, 502.625],  name: 'nodo ext medio piso -1' },
{ id: 'nodo_despachos_b-150', latlng: [656.37431, 632.375],  name: 'nodo despachosb150 ' },
{ id: 'nodo_lab_maquinas_pisoBAJO', latlng: [535.228393, 654.275879], name: 'nodo labs maqs piso -1' },
{ id: 'nodo_labs2_pisoBAJO', latlng: [534.823197, 703.054688], name: 'nodo labs 2 piso -1' },
{ id: 'nodo_B-150s', latlng: [639.057313, 649.706055],  name: 'nodo B -150s' },
{ id: 'nodo_salida_escalera_bloque_B_pisoBAJO', latlng: [639.807396, 668.706055],  name: 'nodo salida escalera bloque B piso -1' },
{ id: 'nodo_principio_pasillo_B_pisoBAJO', latlng: [628.056088, 704.956055],  name: 'nodo pricnipio pasillo B piso -1' },
{ id: 'nodo_labs1_pisoBAJO', latlng: [572.014259, 708.339355], name: 'nodo labs 1 piso -1' },
{ id: 'nodo_talleres_pisoBAJO', latlng: [572.61441, 688.673828],  name: 'nodo talleres piso -1' },
{ id: 'nodo_entrada_escalera_bloque_A_norte_pisoBAJO', latlng: [463.719758, 705.467773],  name: 'nodo entrada escalera bloque A norte piso -1' },
{ id: 'nodo_labs3_pisoBAJO', latlng: [466.799462, 660.509766], name: 'nodo labs 3 piso -1' },
{ id: 'nodo_mitad_pasillo_A_norte_pisoBAJO', latlng: [384.843232, 706.389648],  name: 'nodo mitad pasillo A norte piso -1' },
{ id: 'nodo_labs4_pisoBAJO', latlng: [336.950893, 706.875],  name: 'nodo labs 4 piso -1' },
{ id: 'nodo_final_pasillo_labs_pisoBAJO', latlng: [278.194351, 706.625],  name: 'nodo final pasillo labs piso -1' },
{ id: 'nodo_entrada_escalera_principal_pisoBAJO', latlng: [272.904521, 691.193848],  name: 'nodo entrada escalera principal piso -1' },
{ id: 'nodo_exterior_pisoBAJO', latlng: [270.456191, 647.402344],  name: 'nodo exterior ppiso -1' },
{ id: 'nodo_1_pasillo_pisoBAJO', latlng: [251.311959, 678.499023],  name: 'nodo 1 pasillo piso -1' },
{ id: 'nodo_2_pasillo_pisoBAJO', latlng: [248.568061, 723.252197],  name: 'nodo 2 pasillo piso -1' },
{ id: 'nodo_3_pasillo_pisoBAJO', latlng: [226.757573, 727.754395],  name: 'nodo 3 pasillo piso -1' },
{ id: 'nodo_4_pasillo_pisoBAJO', latlng: [227.632671, 748.254395],  name: 'nodo 4 pasillo piso -1' },
{ id: 'nodo_5_pasillo_pisoBAJO', latlng: [173.832473, 748.75293],  name: 'nodo 5 pasillo piso -1' },
{ id: 'nodo_6_pasillo_pisoBAJO', latlng: [173.535638, 707.787109],  name: 'nodo 6 pasillo piso -1' },
{ id: 'nodo_6_7_pasillo_pisoBAJO', latlng: [173.504704, 670.741418],  name: 'nodo 6-7 pasillo piso -1' },
{ id: 'nodo_7_pasillo_pisoBAJO', latlng: [173.468248, 627.083984],  name: 'nodo 7 pasillo piso -1' },
{ id: 'nodo_8_pasillo_pisoBAJO', latlng: [174.718387, 527.833984],  name: 'nodo 8 pasillo piso -1' },
{ id: 'nodo_9_pasillo_pisoBAJO', latlng: [173.056092, 409.296875],  name: 'nodo 9 pasillo piso -1' },
{ id: 'nodo_entrada_escalera_cafet_pisoBAJO', latlng: [172.701684, 335.305542],  name: 'nodo entrada escalera cafet piso -1' },

{ id: 'nodo_salida_ext_pisoBAJO', latlng: [180.066342, 392.050293],  name: 'nodo dsalida ext piso -1' },
{ id: 'nodo_entrada_escalera_pista_deportiva_pisoBAJO', latlng: [293.739342, 392.451172],  name: 'nodo entrada escalera pista depprtiva piso -1' },
{ id: 'nodo_entrada_salas_pisoBAJO', latlng: [309.525911, 706.044922],  name: 'nodo entrada salas piso -1' },

{ id: 'nodo_bloque_A_subida_escalera_3_pisoBAJO', latlng: [487.768538, 734.208008],  name: 'nodo bloque A subida escaleras 3 piso -1' },
{ id: 'nodo_bloque_A_subida_escalera_2_pisoBAJO', latlng: [464.515949, 735.458008],  name: 'nodo bloque A subida escaleras 2 piso -1' },
{ id: 'nodo_bloque_A_subida_escalera_1_pisoBAJO', latlng: [464.631283, 726.875488],  name: 'nodo escalera bloque A subida 1 piso -1' },

{ id: 'nodo_bloque_B_subida_escalera_3_pisoBAJO', latlng: [689.061094, 664.0625],  name: 'nodo bloque B subida escaleras 3 piso -1' },
{ id: 'nodo_bloque_B_subida_escalera_2_pisoBAJO', latlng: [689.123601, 676.75],  name: 'nodo bloque B subida escaleras 2 piso -1' },
{ id: 'nodo_bloque_B_subida_escalera_1_pisoBAJO', latlng: [668.371291, 676.8125],  name: 'nodo escalera bloque B subida 1 piso -1' },

{ id: 'nodo_conexion_entrada_subida_escalera_3_pisoBAJO', latlng: [94.855581, 663.999023],  name: 'nodo esclaera entrada subida escaleras 3 piso -1' },
{ id: 'nodo_conexion_entrada_subida_escalera_2_pisoBAJO', latlng: [94.855581, 672.624023],  name: 'nodo escalera entrada subida escaleras 2 piso -1' },
{ id: 'nodo_conexion_entrada_subida_escalera_1_pisoBAJO', latlng: [105.856806, 673.124023],  name: 'nodo escalera entrada subida 1 piso -1' },


{ id: 'nodo_conexion_cafeteria_subida_escalera_3_pisoBAJO', latlng: [199.611653, 315.074707],  name: 'nodo esclaera cafetria subida escaleras 3 piso -1' },
{ id: 'nodo_conexion_cafeteria_subida_escalera_2_pisoBAJO', latlng: [200.309159, 335.347168],  name: 'nodo escalera cafeteria subida escaleras 2 piso -1' },


{ id: 'nodo_conexion_terraza_subida_escalera_3_pisoBAJO', latlng: [257.794412, 650.500977],  name: 'nodo escalera terraza subida 1 piso -1' },
{ id: 'nodo_conexion_terraza_subida_escalera_2_pisoBAJO', latlng: [234.916865, 651.000977],  name: 'nodo escalera terraza subida escaleras 2 piso -1' },
{ id: 'nodo_conexion_terraza_subida_escalera_1_pisoBAJO', latlng: [234.091715, 641.816406],  name: 'nodo esclaera terraza subida escaleras 3 piso -1' },


{ id: 'nodo_conexion_pista_deportiva_subida_escalera_1_pisoBAJO', latlng: [298.978173, 369.359375],  name: 'nodo escalera pista deport subida 1 piso -1' },






// //ascensores y/o escaleras

{ id: 'nodo_escalera_principal_pisoBAJO', latlng: [271.154326, 727.068848],  name: 'nodo escalera principal piso -1' },

{ id: 'nodo_escaleras_terraza_SUBIDA_pisoBAJO', latlng: [257.41937, 641.250977], name: 'nodo escaleras terraza piso -1' },

{ id: 'nodo_escalera_entrada_SUBIDA_pisoBAJO', latlng: [110.607335, 663.499023],  name: 'nodo escalera entrada subida piso -1' },

{ id: 'nodo_escalera_bloque_A_SUBIDA_pisoBAJO', latlng: [486.768427, 718.458008],  name: 'nodo escalera bloque A subida piso -1' },

{ id: 'nodo_escalera_bloque_B_SUBIDA_pisoBAJO', latlng: [678.497418, 664.4375],  name: 'nodo escalera bloque B piso -1' },

{ id: 'nodo_escalera_cafeteria_SUBIDA_pisoBAJO', latlng: [186.985247, 314.199707],  name: 'nodo escalera cafeteria piso -1' },

{ id: 'nodo_escalera_pista_deportiva_SUBIDA_pisoBAJO', latlng: [298.665638, 353.203125],  name: 'nodo escalera pista deportiva piso -1' },

]



const edgesPlanta5 = [
    { from: 'nodo_despachos_b-150', to: 'B_150_L2', weight: getDistanceBetweenPoints('nodo_despachos_b-150','B_150_L2', nodosPlanta5) },
    { from: 'nodo_despachos_b-150', to: 'B_150b', weight:  getDistanceBetweenPoints('nodo_despachos_b-150','B_150b', nodosPlanta5)  },
    { from: 'nodo_despachos_b-150', to: 'B_150_2', weight:  getDistanceBetweenPoints('nodo_despachos_b-150','B_150_2', nodosPlanta5) },
    { from: 'nodo_despachos_b-150', to: 'nodo_B-150s', weight:  getDistanceBetweenPoints('nodo_despachos_b-150','nodo_B-150s', nodosPlanta5)},
   
    { from: 'nodo_B-150s', to: 'B_150_L1', weight: getDistanceBetweenPoints('nodo_B-150s','B_150_L1', nodosPlanta5) },
    { from: 'nodo_B-150s', to: 'B_150_1', weight:  getDistanceBetweenPoints('nodo_B-150s','B_150_1', nodosPlanta5) },
    { from: 'nodo_B-150s', to: 'nodo_salida_escalera_bloque_B_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_B-150s','nodo_salida_escalera_bloque_B_pisoBAJO', nodosPlanta5)},
    
    { from: 'nodo_salida_escalera_bloque_B_pisoBAJO', to: 'B_150_1', weight: getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_pisoBAJO','B_150_1', nodosPlanta5) },


    { from: 'nodo_6_7_pasillo_pisoBAJO', to: 'nodo_conexion_entrada_subida_escalera_1_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_6_7_pasillo_pisoBAJO','nodo_conexion_entrada_subida_escalera_1_pisoBAJO', nodosPlanta5) },
    { from: 'nodo_conexion_entrada_subida_escalera_1_pisoBAJO', to: 'nodo_conexion_entrada_subida_escalera_2_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_1_pisoBAJO','nodo_conexion_entrada_subida_escalera_2_pisoBAJO', nodosPlanta5) },
    { from: 'nodo_conexion_entrada_subida_escalera_2_pisoBAJO', to: 'nodo_conexion_entrada_subida_escalera_3_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_2_pisoBAJO','nodo_conexion_entrada_subida_escalera_3_pisoBAJO', nodosPlanta5) },
    { from: 'nodo_conexion_entrada_subida_escalera_3_pisoBAJO', to: 'nodo_escalera_entrada_SUBIDA_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_3_pisoBAJO','nodo_escalera_entrada_SUBIDA_pisoBAJO', nodosPlanta5) },


    { from: 'nodo_salida_escalera_bloque_B_pisoBAJO', to: 'nodo_bloque_B_subida_escalera_1_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_pisoBAJO','nodo_bloque_B_subida_escalera_1_pisoBAJO', nodosPlanta5) },
    { from: 'nodo_bloque_B_subida_escalera_1_pisoBAJO', to: 'nodo_bloque_B_subida_escalera_2_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_bloque_B_subida_escalera_1_pisoBAJO','nodo_bloque_B_subida_escalera_2_pisoBAJO', nodosPlanta5) },
    { from: 'nodo_bloque_B_subida_escalera_2_pisoBAJO', to: 'nodo_bloque_B_subida_escalera_3_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_bloque_B_subida_escalera_2_pisoBAJO','nodo_bloque_B_subida_escalera_3_pisoBAJO', nodosPlanta5) },
    { from: 'nodo_bloque_B_subida_escalera_3_pisoBAJO', to: 'nodo_escalera_bloque_B_SUBIDA_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_bloque_B_subida_escalera_3_pisoBAJO','nodo_escalera_bloque_B_SUBIDA_pisoBAJO', nodosPlanta5) },



    { from: 'nodo_salida_escalera_bloque_B_pisoBAJO', to: 'B_148', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_pisoBAJO','B_148', nodosPlanta5)},
    { from: 'nodo_salida_escalera_bloque_B_pisoBAJO', to: 'nodo_principio_pasillo_B_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_pisoBAJO','nodo_principio_pasillo_B_pisoBAJO', nodosPlanta5)},
   
    { from: 'nodo_principio_pasillo_B_pisoBAJO', to: 'B_148', weight: getDistanceBetweenPoints('nodo_principio_pasillo_B_pisoBAJO','B_148', nodosPlanta5) },
    { from: 'nodo_principio_pasillo_B_pisoBAJO', to: 'nodo_labs1_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_B_pisoBAJO','nodo_labs1_pisoBAJO', nodosPlanta5) },

    { from: 'nodo_labs1_pisoBAJO', to: 'nodo_labs2_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_labs1_pisoBAJO','nodo_labs2_pisoBAJO', nodosPlanta5)},
    { from: 'nodo_labs1_pisoBAJO', to: 'nodo_talleres_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_labs1_pisoBAJO','nodo_talleres_pisoBAJO', nodosPlanta5)},

    { from: 'nodo_talleres_pisoBAJO', to: 'taller2', weight: getDistanceBetweenPoints('nodo_talleres_pisoBAJO','taller2', nodosPlanta5) },
    { from: 'nodo_talleres_pisoBAJO', to: 'taller1', weight:  getDistanceBetweenPoints('nodo_talleres_pisoBAJO','taller1', nodosPlanta5) },
    { from: 'nodo_talleres_pisoBAJO', to: 'A_146', weight:  getDistanceBetweenPoints('nodo_talleres_pisoBAJO','A_146', nodosPlanta5)},

    { from: 'A_146', to: 'A_146_L', weight:  getDistanceBetweenPoints('A_146','A_146_L', nodosPlanta5)},

    { from: 'nodo_labs2_pisoBAJO', to: 'nodo_entrada_escalera_bloque_A_norte_pisoBAJO', weight: getDistanceBetweenPoints('nodo_labs2_pisoBAJO','nodo_entrada_escalera_bloque_A_norte_pisoBAJO', nodosPlanta5) },
    { from: 'nodo_labs2_pisoBAJO', to: 'nodo_lab_maquinas_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_labs2_pisoBAJO','nodo_lab_maquinas_pisoBAJO', nodosPlanta5) },
    
    { from: 'nodo_lab_maquinas_pisoBAJO', to: 'A_144_L1', weight:  getDistanceBetweenPoints('nodo_lab_maquinas_pisoBAJO','A_144_L1', nodosPlanta5)},
    { from: 'nodo_lab_maquinas_pisoBAJO', to: 'A_144_L2', weight:  getDistanceBetweenPoints('nodo_lab_maquinas_pisoBAJO','A_144_L2', nodosPlanta5) },
   
    { from: 'A_144_L2', to: 'taller', weight:  getDistanceBetweenPoints('A_144_L2','taller', nodosPlanta5)},



    { from: 'nodo_entrada_escalera_bloque_A_norte_pisoBAJO', to: 'nodo_bloque_A_subida_escalera_1_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_pisoBAJO','nodo_bloque_A_subida_escalera_1_pisoBAJO', nodosPlanta5)},

    { from: 'nodo_bloque_A_subida_escalera_1_pisoBAJO', to: 'nodo_bloque_A_subida_escalera_2_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_bloque_A_subida_escalera_1_pisoBAJO','nodo_bloque_A_subida_escalera_2_pisoBAJO', nodosPlanta5)},
    { from: 'nodo_bloque_A_subida_escalera_2_pisoBAJO', to: 'nodo_bloque_A_subida_escalera_3_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_bloque_A_subida_escalera_2_pisoBAJO','nodo_bloque_A_subida_escalera_3_pisoBAJO', nodosPlanta5)},
    { from: 'nodo_bloque_A_subida_escalera_3_pisoBAJO', to: 'nodo_escalera_bloque_A_SUBIDA_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_bloque_A_subida_escalera_3_pisoBAJO','nodo_escalera_bloque_A_SUBIDA_pisoBAJO', nodosPlanta5)},




    { from: 'nodo_entrada_escalera_bloque_A_norte_pisoBAJO', to: 'A_140', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_pisoBAJO','A_140', nodosPlanta5)},
    { from: 'nodo_entrada_escalera_bloque_A_norte_pisoBAJO', to: 'A_139', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_pisoBAJO','A_139', nodosPlanta5)},
    { from: 'nodo_entrada_escalera_bloque_A_norte_pisoBAJO', to: 'A_138_L', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_pisoBAJO','A_138_L', nodosPlanta5) },
    { from: 'nodo_entrada_escalera_bloque_A_norte_pisoBAJO', to: 'A_137_L', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_pisoBAJO','A_137_L', nodosPlanta5)},
    { from: 'nodo_entrada_escalera_bloque_A_norte_pisoBAJO', to: 'A_134_L', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_pisoBAJO','A_134_L', nodosPlanta5) },
    { from: 'nodo_entrada_escalera_bloque_A_norte_pisoBAJO', to: 'nodo_mitad_pasillo_A_norte_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_pisoBAJO','nodo_mitad_pasillo_A_norte_pisoBAJO', nodosPlanta5)},
   

    { from: 'A_140', to: 'nodo_labs3_pisoBAJO', weight:  getDistanceBetweenPoints('A_140','nodo_labs3_pisoBAJO', nodosPlanta5)},

    { from: 'nodo_labs3_pisoBAJO', to: 'A_140_L1', weight:  getDistanceBetweenPoints('nodo_labs3_pisoBAJO','A_140_L1', nodosPlanta5)},
    { from: 'nodo_labs3_pisoBAJO', to: 'A_140_A', weight:  getDistanceBetweenPoints('nodo_labs3_pisoBAJO','A_140_A', nodosPlanta5)},
    { from: 'nodo_labs3_pisoBAJO', to: 'A_240_L2', weight:  getDistanceBetweenPoints('nodo_labs3_pisoBAJO','A_240_L2', nodosPlanta5)},

    { from: 'nodo_mitad_pasillo_A_norte_pisoBAJO', to: 'A_139', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_pisoBAJO','A_139', nodosPlanta5)},
    { from: 'nodo_mitad_pasillo_A_norte_pisoBAJO', to: 'A_138_L', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_pisoBAJO','A_138_L', nodosPlanta5) },
    { from: 'nodo_mitad_pasillo_A_norte_pisoBAJO', to: 'A_137_L', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_pisoBAJO','A_137_L', nodosPlanta5)},
    { from: 'nodo_mitad_pasillo_A_norte_pisoBAJO', to: 'A_134_L', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_pisoBAJO','A_134_L', nodosPlanta5) },
    { from: 'nodo_mitad_pasillo_A_norte_pisoBAJO', to: 'A_133_L', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_pisoBAJO','A_133_L', nodosPlanta5)},
    { from: 'nodo_mitad_pasillo_A_norte_pisoBAJO', to: 'nodo_labs4_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_pisoBAJO','nodo_labs4_pisoBAJO', nodosPlanta5) },
  
    { from: 'nodo_labs4_pisoBAJO', to: 'A_133_L', weight:  getDistanceBetweenPoints('nodo_labs4_pisoBAJO','A_133_L', nodosPlanta5)},
    { from: 'nodo_labs4_pisoBAJO', to: 'A_132_L', weight:  getDistanceBetweenPoints('nodo_labs4_pisoBAJO','A_132_L', nodosPlanta5)},
    { from: 'nodo_labs4_pisoBAJO', to: 'nodo_entrada_salas_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_labs4_pisoBAJO','nodo_entrada_salas_pisoBAJO', nodosPlanta5)},
    
    { from: 'nodo_entrada_salas_pisoBAJO', to: 'A_132_L', weight:  getDistanceBetweenPoints('nodo_entrada_salas_pisoBAJO','A_132_L', nodosPlanta5)},
    { from: 'nodo_entrada_salas_pisoBAJO', to: 'A_131_L1', weight:  getDistanceBetweenPoints('nodo_entrada_salas_pisoBAJO','A_131_L1', nodosPlanta5)},
    { from: 'nodo_entrada_salas_pisoBAJO', to: 'nodo_final_pasillo_labs_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_entrada_salas_pisoBAJO','nodo_final_pasillo_labs_pisoBAJO', nodosPlanta5)},

    { from: 'nodo_final_pasillo_labs_pisoBAJO', to: 'nodo_entrada_escalera_principal_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_final_pasillo_labs_pisoBAJO','nodo_entrada_escalera_principal_pisoBAJO', nodosPlanta5)},
            
    { from: 'A_131_L1', to: 'A_129_S2', weight:  getDistanceBetweenPoints('A_131_L1','A_129_S2', nodosPlanta5)},
    { from: 'A_131_L1', to: 'A_129_S1', weight:  getDistanceBetweenPoints('A_131_L1','A_129_S1', nodosPlanta5)},
    { from: 'A_131_L1', to: 'A_131_L2', weight:  getDistanceBetweenPoints('A_131_L1','A_131_L2', nodosPlanta5)},
   
    { from: 'nodo_entrada_escalera_principal_pisoBAJO', to: 'nodo_escalera_principal_pisoBAJO', weight: getDistanceBetweenPoints('nodo_entrada_escalera_principal_pisoBAJO','nodo_escalera_principal_pisoBAJO', nodosPlanta5) },
    { from: 'nodo_entrada_escalera_principal_pisoBAJO', to: 'nodo_exterior_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_principal_pisoBAJO','nodo_exterior_pisoBAJO', nodosPlanta5) },
    { from: 'nodo_entrada_escalera_principal_pisoBAJO', to: 'nodo_1_pasillo_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_principal_pisoBAJO','nodo_1_pasillo_pisoBAJO', nodosPlanta5)},

    { from: 'nodo_1_pasillo_pisoBAJO', to: 'nodo_2_pasillo_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_1_pasillo_pisoBAJO','nodo_2_pasillo_pisoBAJO', nodosPlanta5) },



    { from: 'nodo_exterior_pisoBAJO', to: 'nodo_conexion_terraza_subida_escalera_1_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_exterior_pisoBAJO','nodo_conexion_terraza_subida_escalera_1_pisoBAJO', nodosPlanta5)},
    { from: 'nodo_conexion_terraza_subida_escalera_1_pisoBAJO', to: 'nodo_conexion_terraza_subida_escalera_2_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_conexion_terraza_subida_escalera_1_pisoBAJO','nodo_conexion_terraza_subida_escalera_2_pisoBAJO', nodosPlanta5)},
    { from: 'nodo_conexion_terraza_subida_escalera_2_pisoBAJO', to: 'nodo_conexion_terraza_subida_escalera_3_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_conexion_terraza_subida_escalera_2_pisoBAJO','nodo_conexion_terraza_subida_escalera_3_pisoBAJO', nodosPlanta5)},
    { from: 'nodo_conexion_terraza_subida_escalera_3_pisoBAJO', to: 'nodo_escaleras_terraza_SUBIDA_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_conexion_terraza_subida_escalera_3_pisoBAJO','nodo_escaleras_terraza_SUBIDA_pisoBAJO', nodosPlanta5)},


    { from: 'nodo_exterior_pisoBAJO', to: 'nodo_exterior_medio_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_exterior_pisoBAJO','nodo_exterior_medio_pisoBAJO', nodosPlanta5)},

    { from: 'nodo_escalera_principal_pisoBAJO', to: 'club_deportivo', weight:  getDistanceBetweenPoints('nodo_escalera_principal_pisoBAJO','club_deportivo', nodosPlanta5)},

    { from: 'nodo_3_pasillo_pisoBAJO', to: 'nodo_2_pasillo_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_3_pasillo_pisoBAJO','nodo_2_pasillo_pisoBAJO', nodosPlanta5) },
    { from: 'nodo_3_pasillo_pisoBAJO', to: 'nodo_4_pasillo_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_3_pasillo_pisoBAJO','nodo_4_pasillo_pisoBAJO', nodosPlanta5)},
    { from: 'nodo_3_pasillo_pisoBAJO', to: 'A_125_L', weight:  getDistanceBetweenPoints('nodo_3_pasillo_pisoBAJO','A_125_L', nodosPlanta5)},

    { from: 'nodo_4_pasillo_pisoBAJO', to: 'nodo_5_pasillo_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_4_pasillo_pisoBAJO','nodo_5_pasillo_pisoBAJO', nodosPlanta5)},

    { from: 'nodo_6_pasillo_pisoBAJO', to: 'nodo_5_pasillo_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_6_pasillo_pisoBAJO','nodo_5_pasillo_pisoBAJO', nodosPlanta5)},
    { from: 'nodo_6_pasillo_pisoBAJO', to: 'nodo_6_7_pasillo_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_6_pasillo_pisoBAJO','nodo_6_7_pasillo_pisoBAJO', nodosPlanta5) },

    { from: 'nodo_6_7_pasillo_pisoBAJO', to: 'nodo_7_pasillo_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_6_7_pasillo_pisoBAJO','nodo_7_pasillo_pisoBAJO', nodosPlanta5) },


    { from: 'nodo_6_pasillo_pisoBAJO', to: 'A_113_L', weight:  getDistanceBetweenPoints('nodo_6_pasillo_pisoBAJO','A_113_L', nodosPlanta5)},

    { from: 'nodo_7_pasillo_pisoBAJO', to: 'A_111_L', weight:  getDistanceBetweenPoints('nodo_7_pasillo_pisoBAJO','A_111_L', nodosPlanta5)},
    { from: 'nodo_7_pasillo_pisoBAJO', to: 'A_109_S', weight:  getDistanceBetweenPoints('nodo_7_pasillo_pisoBAJO','A_109_S', nodosPlanta5)},
    { from: 'nodo_7_pasillo_pisoBAJO', to: 'nodo_8_pasillo_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_7_pasillo_pisoBAJO','nodo_8_pasillo_pisoBAJO', nodosPlanta5) },
    

    { from: 'nodo_8_pasillo_pisoBAJO', to: 'A_111_L', weight:  getDistanceBetweenPoints('nodo_8_pasillo_pisoBAJO','A_111_L', nodosPlanta5)},
    { from: 'nodo_8_pasillo_pisoBAJO', to: 'A_109_S', weight:  getDistanceBetweenPoints('nodo_8_pasillo_pisoBAJO','A_109_S', nodosPlanta5)},
    { from: 'nodo_8_pasillo_pisoBAJO', to: 'A_108', weight:  getDistanceBetweenPoints('nodo_8_pasillo_pisoBAJO','A_108', nodosPlanta5) },
    { from: 'nodo_8_pasillo_pisoBAJO', to: 'nodo_9_pasillo_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_8_pasillo_pisoBAJO','nodo_9_pasillo_pisoBAJO', nodosPlanta5)},
    { from: 'nodo_8_pasillo_pisoBAJO', to: 'A_106_S', weight:  getDistanceBetweenPoints('nodo_8_pasillo_pisoBAJO','A_106_S', nodosPlanta5)},
    { from: 'nodo_8_pasillo_pisoBAJO', to: 'A_105', weight:  getDistanceBetweenPoints('nodo_8_pasillo_pisoBAJO','A_105', nodosPlanta5) },
  
    { from: 'nodo_9_pasillo_pisoBAJO', to: 'A_108', weight:  getDistanceBetweenPoints('nodo_9_pasillo_pisoBAJO','A_108', nodosPlanta5) },
    { from: 'nodo_9_pasillo_pisoBAJO', to: 'A_106_S', weight:  getDistanceBetweenPoints('nodo_9_pasillo_pisoBAJO','A_106_S', nodosPlanta5)},
    { from: 'nodo_9_pasillo_pisoBAJO', to: 'A_105', weight:  getDistanceBetweenPoints('nodo_9_pasillo_pisoBAJO','A_105', nodosPlanta5) },
    { from: 'nodo_9_pasillo_pisoBAJO', to: 'nodo_salida_ext_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_9_pasillo_pisoBAJO','nodo_salida_ext_pisoBAJO', nodosPlanta5)},
    { from: 'nodo_9_pasillo_pisoBAJO', to: 'nodo_entrada_escalera_cafet_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_9_pasillo_pisoBAJO','nodo_entrada_escalera_cafet_pisoBAJO', nodosPlanta5)},

    { from: 'nodo_entrada_escalera_cafet_pisoBAJO', to: 'almacen_de_zinico', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_cafet_pisoBAJO','almacen_de_zinico', nodosPlanta5)},
    





    { from: 'nodo_entrada_escalera_cafet_pisoBAJO', to: 'nodo_conexion_cafeteria_subida_escalera_2_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_cafet_pisoBAJO','nodo_conexion_cafeteria_subida_escalera_2_pisoBAJO', nodosPlanta5) },
    { from: 'nodo_conexion_cafeteria_subida_escalera_2_pisoBAJO', to: 'nodo_conexion_cafeteria_subida_escalera_3_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_conexion_cafeteria_subida_escalera_2_pisoBAJO','nodo_conexion_cafeteria_subida_escalera_3_pisoBAJO', nodosPlanta5) },
    { from: 'nodo_conexion_cafeteria_subida_escalera_3_pisoBAJO', to: 'nodo_escalera_cafeteria_SUBIDA_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_conexion_cafeteria_subida_escalera_3_pisoBAJO','nodo_escalera_cafeteria_SUBIDA_pisoBAJO', nodosPlanta5) },
    






    { from: 'nodo_entrada_escalera_pista_deportiva_pisoBAJO', to: 'nodo_salida_ext_pisoBAJO', weight: getDistanceBetweenPoints('nodo_entrada_escalera_pista_deportiva_pisoBAJO','nodo_salida_ext_pisoBAJO', nodosPlanta5) },
    { from: 'nodo_entrada_escalera_pista_deportiva_pisoBAJO', to: 'nodo_exterior_medio_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_pista_deportiva_pisoBAJO','nodo_exterior_medio_pisoBAJO', nodosPlanta5) },

    { from: 'nodo_entrada_escalera_pista_deportiva_pisoBAJO', to: 'nodo_conexion_pista_deportiva_subida_escalera_1_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_pista_deportiva_pisoBAJO','nodo_conexion_pista_deportiva_subida_escalera_1_pisoBAJO', nodosPlanta5)},
    { from: 'nodo_conexion_pista_deportiva_subida_escalera_1_pisoBAJO', to: 'nodo_escalera_pista_deportiva_SUBIDA_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_conexion_pista_deportiva_subida_escalera_1_pisoBAJO','nodo_escalera_pista_deportiva_SUBIDA_pisoBAJO', nodosPlanta5)},
]


todasLasPlantas.planta5 = {}
todasLasPlantas.planta5.nodes = nodosPlanta5
todasLasPlantas.planta5.edges = edgesPlanta5


const nodosPlanta0=[
    //laboratorios
    { id: 'A015_L', latlng: [164.973038, 630.064453], name: 'Lab metalográfico y CNC' },
    { id: 'A012_L', latlng: [137.252833, 571.297852], name: 'Lab de motores' },
    { id: 'A008_L', latlng: [168.10913, 497.125977], name: 'Lab de medioambiente I' },
    { id: 'A007_L', latlng: [183.975154, 446.814453], name: 'Lab de fabricación mecánica' },
    { id: 'A006_L', latlng: [167.109018, 424.625977], name: 'Lab de medioambiente II' },
    { id: 'A005_L', latlng: [168.10913, 388.375977],  name: 'Lab de hidraúlica' },
    { id: 'A004_L', latlng: [167.913795, 322.817383],  name: 'Lab de ensayos destructivos _ mecánica' },
    { id: 'A002_L', latlng: [167.913795, 292.567383],  name: 'Lab de mecánica de fluidos' },
    { id: 'Fablab', latlng: [176.66477, 274.067383],  name: 'Fablab' },
    { id: 'A022_L', latlng: [327.767531, 717.157227], name: 'Lab de automatización' },
    { id: 'A021_L1', latlng: [324.767197, 655.907227], name: 'Lab de electronica I' },
    { id: 'A021_L2', latlng: [323.767086, 603.407227], name: 'Lab de electronica II' },
    { id: 'A021_L3', latlng: [302.014664, 561.907227], name: 'Lab de electronica III' },
    { id: 'A024_L1', latlng: [353.301249, 663.447266], name: 'Lab de elasticidad y resistencia de materiales' },
    { id: 'A024_L2', latlng: [354.551388, 589.197266],  name: 'Lab de mecánica y teoría de mecanismos' },
    { id: 'A024_L3', latlng: [344.900137, 581.598633],  name: 'Lab de instalaciones industriales' },
    { id: 'A024_LP', latlng: [400.555786, 698.447266],  name: 'Lab polivalente' },
    { id: 'A029_L1', latlng: [468.183556, 676.530273],  name: 'Lab de química-física' },
    { id: 'A029_L2', latlng: [463.527641, 609.459961],  name: 'Lab de operaciones y reactores' },
    { id: 'A029_A', latlng: [481.529646, 534.959961],  name: 'cultura de procesos' },
    { id: 'A032_L1', latlng: [534.168442, 665.282227],  name: 'Lab medidas magnéticas I' },
    { id: 'A032_L2', latlng: [534.168442, 641.032227],  name: 'Lab medidas magnéticas II' },
    { id: 'A032_L3', latlng: [533.668386, 606.782227],  name: 'Lab maquinas eléctricas III' },
    { id: 'A032_L7', latlng: [547.919973, 598.032227],  name: 'Lab instalaciones eléctricas' },
    { id: 'A032_L6', latlng: [559.171226, 630.782227],  name: 'Lab centrales y subestaciones' },
    { id: 'A032_L5', latlng: [558.921198, 663.032227],  name: 'Lab protecciones eléctricas' },
    { id: 'A032_L4', latlng: [559.421254, 686.782227],  name: 'Lab proyectos eléctricos' },
    { id: 'A032_A1', latlng: [538.168888, 579.782227],  name: 'Aula Schneider' },

    //despachos
    { id: 'B037', latlng: [649.217768, 685.949219],  name: 'Despacho B 037' },
    { id: 'B036', latlng: [648.663183, 695.976563], name: 'Despacho B 036' },
    { id: 'B034', latlng: [577.17323, 709.032227],  name: 'Despacho B 034' },
    { id: 'B033', latlng: [555.920864, 709.032227],  name: 'Despacho B 033' },
    { id: 'A032', latlng: [533.668386, 687.282227],  name: 'Despacho A 032' },
    { id: 'A031', latlng: [528.167774, 713.532227], name: 'Despacho A 031' },
    { id: 'A030', latlng: [502.414907, 714.032227],  name: 'Despacho A 030' },
    { id: 'A029', latlng: [485.185449, 677.780273],  name: 'Despacho A 029' },
    { id: 'A028_3', latlng: [442.011697, 718.170898],  name: 'Despacho A 028-3' },
    { id: 'A028_2', latlng: [433.51075, 722.170898],  name: 'Despacho A 028-2' },
    { id: 'A028_1', latlng: [426.009915, 719.670898], name: 'Despacho A 028-1' },
    { id: 'A026', latlng: [398.756881, 714.420898],  name: 'Despacho A 026' },
    { id: 'A024', latlng: [435.366206, 696.335449],  name: 'Despacho A 024' },
    { id: 'A021', latlng: [329.517726, 545.407227],  name: 'Despacho A 021' },
    { id: 'A006', latlng: [167.109018, 464.125977],  name: 'Despacho A 006' },
    { id: 'A007', latlng: [184.313082, 394.488281], name: 'Despacho A 007' },
    { id: 'A002', latlng: [156.485454, 272.819336],  name: 'Despacho A 002' },

    //conectar luego solo acceso con ascensor desde le segundo piso
    { id: 'C001', latlng: [467.640017, 422.693359],  name: 'Despacho C 001' },
    { id: 'C002', latlng: [450.263082, 420.443359],  name: 'Despacho C 002' },
    { id: 'C003', latlng: [433.649904, 418.427734],  name: 'Despacho C 003' },
    { id: 'C004', latlng: [416.898039, 416.677734],  name: 'Despacho C 004' },
    { id: 'C005', latlng: [400.665763, 414.797852], name: 'Despacho C 005' },
    { id: 'C006', latlng: [384.079465, 412.095703],  name: 'Despacho C 006' },
    { id: 'C007', latlng: [366.827544, 412.345703],  name: 'Despacho C 007' },
    { id: 'C008', latlng: [350.325707, 409.595703],  name: 'Despacho C 008' },
    { id: 'C009', latlng: [330.073452, 403.845703], name: 'Despacho C 009' },

    //Aulas
    { id: 'A01', latlng: [183.475098, 611.064453],  name: 'A01' },
    { id: 'A02', latlng: [183.725126, 593.064453], name: 'A02' },
    { id: 'A03', latlng: [184.975265, 549.314453],  name: 'A03' },
    { id: 'A04', latlng: [184.725238, 499.564453],  name: 'A04' },
    { id: 'A05', latlng: [241.148512, 266.692383],  name: 'A05' },
    { id: 'A06', latlng: [241.39854, 241.692383], name: 'A06' },
    { id: 'A07', latlng: [253.149848, 264.692383],  name: 'A07' },
    { id: 'A08', latlng: [253.149848, 239.942383],  name: 'A08' },
    { id: 'B01', latlng: [653.594032, 651.610352],  name: 'B01' },
    { id: 'B02', latlng: [619.215204, 582.360352],  name: 'B02' },


    //Asociaciones
    { id: 'B042', latlng: [629.765128, 505.943359], name: 'Cuarto de Asociaciones' },
    { id: 'B041', latlng: [616.764237, 523.693359],  name: 'Club de montaña' },
    { id: 'A019', latlng: [251.47681, 697.844727],  name: 'Delegación de alumnos' },

    //Otros
    { id: 'hall_entrada', latlng: [185.681162, 705.977539],  name: 'Hall Entrada' },
    { id: 'pista_deportiva', latlng: [242.538079, 305.412109],  name: 'Pista Deportiva' },
    { id: 'enfermeria', latlng: [272.229121, 698.344727],  name: 'Enfermería' },
    { id: 'A025', latlng: [370.753763, 713.920898], name: 'Reprografía' },
    { id: 'A023', latlng: [345.519508, 714.157227],  name: 'Servicio de publicaciones' },

    //Nodos
    { id: 'nodo_A05_08_sur', latlng: [245.126972, 289.598633],  name: 'nodo A05-A08' },
    { id: 'nodo_final_pasillo_A_sur', latlng: [177.092246, 292.087158],  name: 'nodo final pasillo A Sur' },
    { id: 'nodo_medio_pasillo_A_sur', latlng: [175.667767, 466.422119], name: 'nodo medio pasillo A Sur' },
    { id: 'nodo_baño_pasillo_A_sur', latlng: [174.987233, 351.323242], name: 'nodo baño pasillo A Sur' },
    { id: 'nodo_pasillo_A_lab_motores_sur', latlng: [173.669676, 579.188477],  name: 'nodo pasillo A Lab Motores' },
    { id: 'nodo_principio_pasillo_A_sur', latlng: [175.376898, 659.699219],  name: 'nodo principio pasillo A' },
    { id: 'nodo_principio_pasillo_A_norte', latlng: [238.560579, 707.199219],  name: 'nodo principio pasillo A Norte' },
    { id: 'nodo_entrada_A021s_norte', latlng: [311.486668, 694.144531],  name: 'nodo entrada A 021s' },
    { id: 'nodo_medio_A021s_norte', latlng: [328.738588, 687.894531], name: 'nodo medio A 021s' },
    { id: 'nodo_final_A021s_norte', latlng: [329.7387, 570.644531],  name: 'nodo final A 021s' },
    { id: 'nodo_pasillo_A021s_norte', latlng: [311.23664, 705.144531],  name: 'nodo pasillo A 021s' },
    { id: 'nodo_first_half_pasillo_A_norte', latlng: [384.994852, 706.144531],  name: 'nodo first half pasillo A Norte' },
    { id: 'nodo_entrada_A024s_norte', latlng: [364.228109, 700.094727],  name: 'nodo entrada A 024s norte' },
    { id: 'nodo_entrada_A028s_norte', latlng: [434.366488, 706.710449],  name: 'nodo entrada A 028s norte' },
    { id: 'nodo_entrada_A029s_norte', latlng: [468.953507, 707.030273],  name: 'nodo entrada A 029s norte' },
    { id: 'nodo_second_half_pasillo_A_norte', latlng: [540.064148, 703.417969], name: 'nodo second half pasillo A Norte' },
    { id: 'nodo_entrada_A032s_norte', latlng: [541.844592, 690.052734],  name: 'nodo entrada A 032s norte' },
    { id: 'nodo_final_pasillo_A_norte', latlng: [635.764304, 701.970703],  name: 'nodo final pasillo A norte' },
    { id: 'nodo_principio_pasillo_B', latlng: [639.514722, 668.720703], name: 'nodo principio pasillo B' },
    { id: 'nodo_mitad_pasillo_B', latlng: [608.011214, 663.470703],  name: 'nodo mitad pasillo B' },
    { id: 'nodo_final_pasillo_B', latlng: [606.010992, 542.970703],  name: 'nodo final pasillo B' },
    { id: 'nodo_principio_pasillo_asociaciones', latlng: [620.689304, 537.648926],  name: 'nodo principio pasillo asocioaciones' },
    { id: 'nodo_final_pasillo_asociaciones', latlng: [616.43883, 500.273926],  name: 'nodo final pasillo asocioaciones' },
    { id: 'nodo_bloque_C_norte', latlng: [461.198437, 414.850586],  name: 'nodo escalera bloque C norte' },
    { id: 'nodo_bloque_C_sur', latlng: [376.716109, 405.686035],  name: 'nodo escalera bloque C sur' },

    { id: 'nodo_bloque_A_subida_escalera_3_piso0', latlng: [487.768538, 734.208008],  name: 'nodo bloque A subida escaleras 3 piso 0' },
{ id: 'nodo_bloque_A_subida_escalera_2_piso0', latlng: [464.515949, 735.458008],  name: 'nodo bloque A subida escaleras 2 piso 0' },
{ id: 'nodo_bloque_A_subida_escalera_1_piso0', latlng: [464.631283, 726.875488],  name: 'nodo escalera bloque A subida 1 piso 0' },

{ id: 'nodo_bloque_B_subida_escalera_3_piso0', latlng: [689.061094, 664.0625],  name: 'nodo bloque B subida escaleras 3 piso 0' },
{ id: 'nodo_bloque_B_subida_escalera_2_piso0', latlng: [689.123601, 676.75],  name: 'nodo bloque B subida escaleras 2 piso 0' },
{ id: 'nodo_bloque_B_subida_escalera_1_piso0', latlng: [668.371291, 676.8125],  name: 'nodo escalera bloque B subida 1 piso 0' },

{ id: 'nodo_conexion_entrada_subida_escalera_3_piso0', latlng: [97.54338, 662.842773],  name: 'nodo esclaera entrada subida escaleras 3 piso 0' },
{ id: 'nodo_conexion_entrada_subida_escalera_2_piso0', latlng: [97.418366, 672.717773],  name: 'nodo escalera entrada subida escaleras 2 piso 0' },
{ id: 'nodo_conexion_entrada_subida_escalera_1_piso0', latlng: [105.856806, 673.124023],  name: 'nodo escalera entrada subida 1 piso 0' },


{ id: 'nodo_conexion_cafeteria_subida_escalera_3_piso0', latlng: [199.611653, 315.074707],  name: 'nodo esclaera cafetria subida escaleras 3 piso 0' },
{ id: 'nodo_conexion_cafeteria_subida_escalera_2_piso0', latlng: [200.309159, 335.347168],  name: 'nodo escalera cafeteria subida escaleras 2 piso 0' },
{ id: 'nodo_conexion_cafeteria_subida_escalera_1_piso0', latlng: [184.269361, 335],  name: 'nodo escalera cafeteria subida escaleras 1 piso 0' },


{ id: 'nodo_conexion_principal_subida_escalera_3_piso0', latlng: [272.00574, 725.628906],  name: 'nodo esclaera principal subida escaleras 3 piso 0' },
{ id: 'nodo_conexion_principal_subida_escalera_2_piso0', latlng: [272.00574, 746.128906],  name: 'nodo escalera principal subida escaleras 2 piso 0' },
{ id: 'nodo_conexion_principal_subida_escalera_1_piso0', latlng: [246.750762, 746.003906],  name: 'nodo escalera principal subida escaleras 1 piso 0' },



{ id: 'nodo_conexion_terraza_subida_escalera_3_piso0', latlng: [257.794412, 650.500977],  name: 'nodo escalera terraza subida 1 piso 0' },
{ id: 'nodo_conexion_terraza_subida_escalera_2_piso0', latlng: [234.916865, 651.000977],  name: 'nodo escalera terraza subida escaleras 2 piso 0' },

{ id: 'nodo_subida_escalera_bloque_B_secundaria_1_piso0', latlng: [614.016403, 484.71582],  name: 'nodo escalera bloque B subida escalera secundaria 1 piso 0' },


{ id: 'nodo_acceso_escalera_entrada', latlng: [132.635314, 673.236328],  name: 'nodo escalera entrada' },
{ id: 'nodo_acceso_escalera_cafeteria', latlng: [175.992478, 323.035153],  name: 'nodo escalera cafeteria' },
{ id: 'nodo_acceso_escalera_principal', latlng: [233.634218, 735.366211],  name: 'nodo escalera cafeteria' },
   



  //ascensores y/o escaleras
    { id: 'nodo_escalera_principal_SUBIDA_piso0', latlng: [272.00574, 725.628906],  name: 'nodo escalera principal subida piso 0' },
    { id: 'nodo_escalera_principal_BAJADA_piso0', latlng: [247.773326, 726.43457],  name: 'nodo escalera principal bajada piso 0' },
   
    { id: 'nodo_escalera_entrada_SUBIDA_piso0', latlng: [97.54338, 662.842773],  name: 'nodo escalera entrada subida piso 0' },
    { id: 'nodo_escalera_entrada_BAJADA_piso0', latlng: [110.607335, 663.499023],  name: 'nodo escalera entrada subida piso 0' },
    
    { id: 'nodo_escalera_bloque_A_SUBIDA_piso0', latlng: [487.768538, 734.208008],  name: 'nodo escalera bloque A subida piso 0' },
    { id: 'nodo_escalera_bloque_A_BAJADA_piso0', latlng: [486.768427, 718.458008],  name: 'nodo escalera bloque A subida piso 0' },

    { id: 'nodo_escalera_bloque_B_SUBIDA_piso0', latlng: [689.061094, 664.0625],  name: 'nodo escalera bloque B piso 0' },

    { id: 'nodo_escalera_bloque_B_BAJADA_piso0', latlng: [678.497418, 664.4375],  name: 'nodo escalera bloque B piso 0' },

    { id: 'nodo_escaleras_terraza_SUBIDA_piso0', latlng: [257.41937, 641.250977], name: 'nodo escaleras terraza piso 0' },

    { id: 'nodo_escaleras_terraza_BAJADA_piso0', latlng: [234.091715, 641.816406],  name: 'nodo esclaera terraza subida escaleras 3 piso 0' },

    { id: 'nodo_escalera_cafeteria_SUBIDA_piso0', latlng: [199.611653, 315.074707],  name: 'nodo escalera cafeteria piso 0' },

    { id: 'nodo_escalera_cafeteria_BAJADA_piso0', latlng: [186.985247, 314.199707],  name: 'nodo escalera cafeteria piso 0' },

   { id: 'nodo_escalera_bloque_B_secundaria_SUBIDA_piso0', latlng: [630.404609, 484.193359],  name: 'nodo escalera bloque B segundaria' },


    { id: 'nodo_escalera_bloque_C', latlng: [421.415429, 408.658203],  name: 'nodo escalera bloque C' },
    
    { id: 'nodo_escalera_pista_deportiva_BAJADA_piso0', latlng: [304.229235, 353.390625],  name: 'nodo escalera pista deportiva piso 0' },
    
]


const edgesPlanta0 = [
    { from: 'nodo_escalera_pista_deportiva_BAJADA_piso0', to: 'pista_deportiva', weight: getDistanceBetweenPoints('nodo_escalera_pista_deportiva_BAJADA_piso0','pista_deportiva', nodosPlanta0) },
   
    { from: 'hall_entrada', to: 'nodo_principio_pasillo_A_sur', weight: getDistanceBetweenPoints('hall_entrada','nodo_principio_pasillo_A_sur', nodosPlanta0) },
    { from: 'hall_entrada', to: 'nodo_principio_pasillo_A_norte', weight:  getDistanceBetweenPoints('hall_entrada','nodo_principio_pasillo_A_norte', nodosPlanta0)  },
    { from: 'hall_entrada', to: 'nodo_conexion_terraza_subida_escalera_2_piso0', weight:  getDistanceBetweenPoints('hall_entrada','nodo_conexion_terraza_subida_escalera_2_piso0', nodosPlanta0) },
    { from: 'hall_entrada', to: 'nodo_acceso_escalera_principal', weight:  getDistanceBetweenPoints('hall_entrada','nodo_acceso_escalera_principal', nodosPlanta0)},
    { from: 'hall_entrada', to: 'nodo_acceso_escalera_entrada', weight:  getDistanceBetweenPoints('hall_entrada','nodo_acceso_escalera_entrada', nodosPlanta0) },

    { from: 'nodo_conexion_entrada_subida_escalera_1_piso0', to: 'nodo_acceso_escalera_entrada', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_1_piso0','nodo_acceso_escalera_entrada', nodosPlanta0) },
    { from: 'nodo_escalera_entrada_BAJADA_piso0', to: 'nodo_acceso_escalera_entrada', weight:  getDistanceBetweenPoints('nodo_escalera_entrada_BAJADA_piso0','nodo_acceso_escalera_entrada', nodosPlanta0) },


    { from: 'nodo_conexion_entrada_subida_escalera_1_piso0', to: 'nodo_conexion_entrada_subida_escalera_2_piso0', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_1_piso0','nodo_conexion_entrada_subida_escalera_2_piso0', nodosPlanta0) },
    { from: 'nodo_conexion_entrada_subida_escalera_3_piso0', to: 'nodo_conexion_entrada_subida_escalera_2_piso0', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_3_piso0','nodo_conexion_entrada_subida_escalera_2_piso0', nodosPlanta0) },
    { from: 'nodo_conexion_entrada_subida_escalera_3_piso0', to: 'nodo_escalera_entrada_SUBIDA_piso0', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_3_piso0','nodo_escalera_entrada_SUBIDA_piso0', nodosPlanta0) },


    { from: 'nodo_conexion_terraza_subida_escalera_2_piso0', to: 'nodo_escaleras_terraza_BAJADA_piso0', weight:  getDistanceBetweenPoints('nodo_conexion_terraza_subida_escalera_2_piso0','nodo_escaleras_terraza_BAJADA_piso0', nodosPlanta0) },
    { from: 'nodo_conexion_terraza_subida_escalera_2_piso0', to: 'nodo_conexion_terraza_subida_escalera_3_piso0', weight:  getDistanceBetweenPoints('nodo_conexion_terraza_subida_escalera_2_piso0','nodo_conexion_terraza_subida_escalera_3_piso0', nodosPlanta0) },
    { from: 'nodo_escaleras_terraza_SUBIDA_piso0', to: 'nodo_conexion_terraza_subida_escalera_3_piso0', weight:  getDistanceBetweenPoints('nodo_escaleras_terraza_SUBIDA_piso0','nodo_conexion_terraza_subida_escalera_3_piso0', nodosPlanta0) },

    { from: 'nodo_principio_pasillo_A_norte', to: 'nodo_principio_pasillo_A_sur', weight: getDistanceBetweenPoints('nodo_principio_pasillo_A_norte','nodo_principio_pasillo_A_sur', nodosPlanta0) },
    { from: 'nodo_principio_pasillo_A_norte', to: 'nodo_conexion_terraza_subida_escalera_2_piso0', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte','nodo_conexion_terraza_subida_escalera_2_piso0', nodosPlanta0) },


    { from: 'nodo_principio_pasillo_A_norte', to: 'nodo_acceso_escalera_principal', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte','nodo_acceso_escalera_principal', nodosPlanta0)},

    { from: 'nodo_escalera_principal_BAJADA_piso0', to: 'nodo_acceso_escalera_principal', weight:  getDistanceBetweenPoints('nodo_escalera_principal_BAJADA_piso0','nodo_acceso_escalera_principal', nodosPlanta0)},

    { from: 'nodo_conexion_principal_subida_escalera_1_piso0', to: 'nodo_acceso_escalera_principal', weight:  getDistanceBetweenPoints('nodo_conexion_principal_subida_escalera_1_piso0','nodo_acceso_escalera_principal', nodosPlanta0)},
    { from: 'nodo_conexion_principal_subida_escalera_1_piso0', to: 'nodo_conexion_principal_subida_escalera_2_piso0', weight:  getDistanceBetweenPoints('nodo_conexion_principal_subida_escalera_1_piso0','nodo_conexion_principal_subida_escalera_2_piso0', nodosPlanta0)},
    { from: 'nodo_conexion_principal_subida_escalera_3_piso0', to: 'nodo_conexion_principal_subida_escalera_2_piso0', weight:  getDistanceBetweenPoints('nodo_conexion_principal_subida_escalera_3_piso0','nodo_conexion_principal_subida_escalera_2_piso0', nodosPlanta0)},
    { from: 'nodo_conexion_principal_subida_escalera_3_piso0', to: 'nodo_escalera_principal_SUBIDA_piso0', weight:  getDistanceBetweenPoints('nodo_conexion_principal_subida_escalera_3_piso0','nodo_escalera_principal_SUBIDA_piso0', nodosPlanta0)},





    { from: 'nodo_principio_pasillo_A_norte', to: 'A019', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte','A019', nodosPlanta0)},
    { from: 'nodo_principio_pasillo_A_norte', to: 'enfermeria', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte','enfermeria', nodosPlanta0) },
    
    { from: 'nodo_principio_pasillo_A_sur', to: 'A015_L', weight: getDistanceBetweenPoints('nodo_principio_pasillo_A_sur','A015_L', nodosPlanta0) },
    { from: 'nodo_principio_pasillo_A_sur', to: 'A01', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur','A01', nodosPlanta0) },
    { from: 'nodo_principio_pasillo_A_sur', to: 'A02', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur','A02', nodosPlanta0)},
    { from: 'nodo_principio_pasillo_A_sur', to: 'nodo_pasillo_A_lab_motores_sur', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur','nodo_pasillo_A_lab_motores_sur', nodosPlanta0)},
    { from: 'nodo_principio_pasillo_A_sur', to: 'nodo_acceso_escalera_entrada', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur','nodo_acceso_escalera_entrada', nodosPlanta0)},

    { from: 'nodo_pasillo_A_lab_motores_sur', to: 'A015_L', weight: getDistanceBetweenPoints('nodo_pasillo_A_lab_motores_sur','A015_L', nodosPlanta0) },
    { from: 'nodo_pasillo_A_lab_motores_sur', to: 'A01', weight:  getDistanceBetweenPoints('nodo_pasillo_A_lab_motores_sur','A01', nodosPlanta0) },
    { from: 'nodo_pasillo_A_lab_motores_sur', to: 'A02', weight:  getDistanceBetweenPoints('nodo_pasillo_A_lab_motores_sur','A02', nodosPlanta0)},
    { from: 'nodo_pasillo_A_lab_motores_sur', to: 'A012_L', weight:  getDistanceBetweenPoints('nodo_pasillo_A_lab_motores_sur','A012_L', nodosPlanta0)},
    { from: 'nodo_pasillo_A_lab_motores_sur', to: 'A03', weight: getDistanceBetweenPoints('nodo_pasillo_A_lab_motores_sur','A03', nodosPlanta0) },
    { from: 'nodo_pasillo_A_lab_motores_sur', to: 'A04', weight:  getDistanceBetweenPoints('nodo_pasillo_A_lab_motores_sur','A04', nodosPlanta0) },
    { from: 'nodo_pasillo_A_lab_motores_sur', to: 'A008_L', weight:  getDistanceBetweenPoints('nodo_pasillo_A_lab_motores_sur','A008_L', nodosPlanta0)},
    { from: 'nodo_pasillo_A_lab_motores_sur', to: 'nodo_medio_pasillo_A_sur', weight:  getDistanceBetweenPoints('nodo_pasillo_A_lab_motores_sur','nodo_medio_pasillo_A_sur', nodosPlanta0)},

    { from: 'nodo_medio_pasillo_A_sur', to: 'A03', weight: getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A03', nodosPlanta0) },
    { from: 'nodo_medio_pasillo_A_sur', to: 'A04', weight:  getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A04', nodosPlanta0) },
    { from: 'nodo_medio_pasillo_A_sur', to: 'A008_L', weight:  getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A008_L', nodosPlanta0)},
    { from: 'nodo_medio_pasillo_A_sur', to: 'A006', weight:  getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A006', nodosPlanta0) },
    { from: 'nodo_medio_pasillo_A_sur', to: 'A007_L', weight:  getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A007_L', nodosPlanta0)},
    { from: 'nodo_medio_pasillo_A_sur', to: 'A006_L', weight:  getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A006_L', nodosPlanta0)},
    { from: 'nodo_medio_pasillo_A_sur', to: 'A007', weight:  getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A007', nodosPlanta0)},
    { from: 'nodo_medio_pasillo_A_sur', to: 'A005_L', weight:  getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A005_L', nodosPlanta0)},
    { from: 'nodo_medio_pasillo_A_sur', to: 'A006', weight:  getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A006', nodosPlanta0) },

    { from: 'nodo_baño_pasillo_A_sur', to: 'A007_L', weight:  getDistanceBetweenPoints('nodo_baño_pasillo_A_sur','A007_L', nodosPlanta0)},
    { from: 'nodo_baño_pasillo_A_sur', to: 'A006_L', weight:  getDistanceBetweenPoints('nodo_baño_pasillo_A_sur','A006_L', nodosPlanta0)},
    { from: 'nodo_baño_pasillo_A_sur', to: 'A007', weight:  getDistanceBetweenPoints('nodo_baño_pasillo_A_sur','A007', nodosPlanta0)},
    { from: 'nodo_baño_pasillo_A_sur', to: 'A005_L', weight:  getDistanceBetweenPoints('nodo_baño_pasillo_A_sur','A005_L', nodosPlanta0)},
    { from: 'nodo_baño_pasillo_A_sur', to: 'A004_L', weight:  getDistanceBetweenPoints('nodo_baño_pasillo_A_sur','A004_L', nodosPlanta0)},
    { from: 'nodo_baño_pasillo_A_sur', to: 'nodo_final_pasillo_A_sur', weight:  getDistanceBetweenPoints('nodo_baño_pasillo_A_sur','nodo_final_pasillo_A_sur', nodosPlanta0)},
    { from: 'nodo_baño_pasillo_A_sur', to: 'nodo_acceso_escalera_cafeteria', weight:  getDistanceBetweenPoints('nodo_baño_pasillo_A_sur','nodo_acceso_escalera_cafeteria', nodosPlanta0)},
    
    { from: 'nodo_final_pasillo_A_sur', to: 'nodo_acceso_escalera_cafeteria', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur','nodo_acceso_escalera_cafeteria', nodosPlanta0)},


    { from: 'nodo_conexion_cafeteria_subida_escalera_1_piso0', to: 'nodo_acceso_escalera_cafeteria', weight:  getDistanceBetweenPoints('nodo_conexion_cafeteria_subida_escalera_1_piso0','nodo_acceso_escalera_cafeteria', nodosPlanta0)},
    { from: 'nodo_conexion_cafeteria_subida_escalera_1_piso0', to: 'nodo_conexion_cafeteria_subida_escalera_2_piso0', weight:  getDistanceBetweenPoints('nodo_conexion_cafeteria_subida_escalera_1_piso0','nodo_conexion_cafeteria_subida_escalera_2_piso0', nodosPlanta0)},
    { from: 'nodo_conexion_cafeteria_subida_escalera_3_piso0', to: 'nodo_conexion_cafeteria_subida_escalera_2_piso0', weight:  getDistanceBetweenPoints('nodo_conexion_cafeteria_subida_escalera_3_piso0','nodo_conexion_cafeteria_subida_escalera_2_piso0', nodosPlanta0)},
    { from: 'nodo_conexion_cafeteria_subida_escalera_3_piso0', to: 'nodo_escalera_cafeteria_SUBIDA_piso0', weight:  getDistanceBetweenPoints('nodo_conexion_cafeteria_subida_escalera_3_piso0','nodo_escalera_cafeteria_SUBIDA_piso0', nodosPlanta0)},



    { from: 'nodo_escalera_cafeteria_BAJADA_piso0', to: 'nodo_acceso_escalera_cafeteria', weight:  getDistanceBetweenPoints('nodo_escalera_cafeteria_BAJADA_piso0','nodo_acceso_escalera_cafeteria', nodosPlanta0)},

    { from: 'nodo_final_pasillo_A_sur', to: 'A004_L', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur','A004_L', nodosPlanta0)},
    { from: 'nodo_final_pasillo_A_sur', to: 'A002_L', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur','A002_L', nodosPlanta0)},
    { from: 'nodo_final_pasillo_A_sur', to: 'Fablab', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur','Fablab', nodosPlanta0)},
    { from: 'nodo_final_pasillo_A_sur', to: 'nodo_A05_08_sur', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur','nodo_A05_08_sur', nodosPlanta0)},
    
    { from: 'A002', to: 'A002_L', weight:  getDistanceBetweenPoints('A002','A002_L', nodosPlanta0)},

    { from: 'nodo_A05_08_sur', to: 'pista_deportiva', weight:  getDistanceBetweenPoints('nodo_A05_08_sur','pista_deportiva', nodosPlanta0)},
    { from: 'nodo_A05_08_sur', to: 'A05', weight:  getDistanceBetweenPoints('nodo_A05_08_sur','A05', nodosPlanta0)},
    { from: 'nodo_A05_08_sur', to: 'A06', weight:  getDistanceBetweenPoints('nodo_A05_08_sur','A06', nodosPlanta0)},
    { from: 'nodo_A05_08_sur', to: 'A07', weight:  getDistanceBetweenPoints('nodo_A05_08_sur','A07', nodosPlanta0)},
    { from: 'nodo_A05_08_sur', to: 'A08', weight:  getDistanceBetweenPoints('nodo_A05_08_sur','A08', nodosPlanta0)},

    { from: 'nodo_pasillo_A021s_norte', to: 'nodo_principio_pasillo_A_norte', weight: getDistanceBetweenPoints('nodo_pasillo_A021s_norte','nodo_principio_pasillo_A_norte', nodosPlanta0) },
    { from: 'nodo_pasillo_A021s_norte', to: 'enfermeria', weight:  getDistanceBetweenPoints('nodo_pasillo_A021s_norte','enfermeria', nodosPlanta0) },
    { from: 'nodo_pasillo_A021s_norte', to: 'A019', weight:  getDistanceBetweenPoints('nodo_pasillo_A021s_norte','A019', nodosPlanta0)},
    { from: 'nodo_pasillo_A021s_norte', to: 'nodo_entrada_A021s_norte', weight:  getDistanceBetweenPoints('nodo_pasillo_A021s_norte','nodo_entrada_A021s_norte', nodosPlanta0) },
    { from: 'nodo_pasillo_A021s_norte', to: 'A022_L', weight:  getDistanceBetweenPoints('nodo_pasillo_A021s_norte','A022_L', nodosPlanta0)},
    { from: 'nodo_pasillo_A021s_norte', to: 'A023', weight:  getDistanceBetweenPoints('nodo_pasillo_A021s_norte','A023', nodosPlanta0)},
    { from: 'nodo_pasillo_A021s_norte', to: 'A025', weight:  getDistanceBetweenPoints('nodo_pasillo_A021s_norte','A025', nodosPlanta0)},
    { from: 'nodo_pasillo_A021s_norte', to: 'nodo_entrada_A024s_norte', weight:  getDistanceBetweenPoints('nodo_pasillo_A021s_norte','nodo_entrada_A024s_norte', nodosPlanta0) },
    { from: 'nodo_pasillo_A021s_norte', to: 'nodo_first_half_pasillo_A_norte', weight:  getDistanceBetweenPoints('nodo_pasillo_A021s_norte','nodo_first_half_pasillo_A_norte', nodosPlanta0)},

    { from: 'nodo_entrada_A021s_norte', to: 'nodo_medio_A021s_norte', weight: getDistanceBetweenPoints('nodo_entrada_A021s_norte','nodo_medio_A021s_norte', nodosPlanta0) },

    { from: 'nodo_medio_A021s_norte', to: 'A021_L1', weight:  getDistanceBetweenPoints('nodo_medio_A021s_norte','A021_L1', nodosPlanta0) },
    { from: 'nodo_medio_A021s_norte', to: 'A021_L2', weight:  getDistanceBetweenPoints('nodo_medio_A021s_norte','A021_L2', nodosPlanta0)},
    { from: 'nodo_medio_A021s_norte', to: 'nodo_final_A021s_norte', weight:  getDistanceBetweenPoints('nodo_medio_A021s_norte','nodo_final_A021s_norte', nodosPlanta0)},

    { from: 'nodo_final_A021s_norte', to: 'A021', weight:  getDistanceBetweenPoints('nodo_final_A021s_norte','A021', nodosPlanta0)},
    { from: 'nodo_final_A021s_norte', to: 'A021_L3', weight:  getDistanceBetweenPoints('nodo_final_A021s_norte','A021_L3', nodosPlanta0)},
    { from: 'nodo_final_A021s_norte', to: 'A021_L1', weight:  getDistanceBetweenPoints('nodo_final_A021s_norte','A021_L1', nodosPlanta0) },
    { from: 'nodo_final_A021s_norte', to: 'A021_L2', weight:  getDistanceBetweenPoints('nodo_final_A021s_norte','A021_L2', nodosPlanta0)},

    { from: 'nodo_entrada_A024s_norte', to: 'A024_L1', weight:  getDistanceBetweenPoints('nodo_entrada_A024s_norte','A024_L1', nodosPlanta0)},
    { from: 'nodo_entrada_A024s_norte', to: 'A024_L2', weight:  getDistanceBetweenPoints('nodo_entrada_A024s_norte','A024_L2', nodosPlanta0)},
    { from: 'nodo_entrada_A024s_norte', to: 'A024_L3', weight:  getDistanceBetweenPoints('nodo_entrada_A024s_norte','A024_L3', nodosPlanta0) },
    
    { from: 'nodo_first_half_pasillo_A_norte', to: 'A022_L', weight:  getDistanceBetweenPoints('nodo_first_half_pasillo_A_norte','A022_L', nodosPlanta0)},
    { from: 'nodo_first_half_pasillo_A_norte', to: 'A023', weight:  getDistanceBetweenPoints('nodo_first_half_pasillo_A_norte','A023', nodosPlanta0)},
    { from: 'nodo_first_half_pasillo_A_norte', to: 'A025', weight:  getDistanceBetweenPoints('nodo_first_half_pasillo_A_norte','A025', nodosPlanta0)},
    { from: 'nodo_first_half_pasillo_A_norte', to: 'nodo_entrada_A024s_norte', weight:  getDistanceBetweenPoints('nodo_first_half_pasillo_A_norte','nodo_entrada_A024s_norte', nodosPlanta0) },
    { from: 'nodo_first_half_pasillo_A_norte', to: 'A024_LP', weight: getDistanceBetweenPoints('nodo_first_half_pasillo_A_norte','A024_LP', nodosPlanta0) },
    { from: 'nodo_first_half_pasillo_A_norte', to: 'A026', weight:  getDistanceBetweenPoints('nodo_first_half_pasillo_A_norte','A026', nodosPlanta0) },
    { from: 'nodo_first_half_pasillo_A_norte', to: 'nodo_entrada_A028s_norte', weight:  getDistanceBetweenPoints('nodo_first_half_pasillo_A_norte','nodo_entrada_A028s_norte', nodosPlanta0)},

    { from: 'nodo_entrada_A028s_norte', to: 'A024', weight:  getDistanceBetweenPoints('nodo_entrada_A028s_norte','A024', nodosPlanta0)},
    { from: 'nodo_entrada_A028s_norte', to: 'A028_1', weight:  getDistanceBetweenPoints('nodo_entrada_A028s_norte','A028_1', nodosPlanta0) },
    { from: 'nodo_entrada_A028s_norte', to: 'A028_2', weight: getDistanceBetweenPoints('nodo_entrada_A028s_norte','A028_2', nodosPlanta0) },
    { from: 'nodo_entrada_A028s_norte', to: 'A028_3', weight:  getDistanceBetweenPoints('nodo_entrada_A028s_norte','A028_3', nodosPlanta0) },
    { from: 'nodo_entrada_A028s_norte', to: 'nodo_entrada_A029s_norte', weight:  getDistanceBetweenPoints('nodo_entrada_A028s_norte','nodo_entrada_A029s_norte', nodosPlanta0)},
    { from: 'nodo_entrada_A028s_norte', to: 'A024_LP', weight: getDistanceBetweenPoints('nodo_entrada_A028s_norte','A024_LP', nodosPlanta0) },
    { from: 'nodo_entrada_A028s_norte', to: 'A026', weight:  getDistanceBetweenPoints('nodo_entrada_A028s_norte','A026', nodosPlanta0) },
    
    { from: 'nodo_entrada_A029s_norte', to: 'A029_L1', weight:  getDistanceBetweenPoints('nodo_entrada_A029s_norte','A029_L1', nodosPlanta0)},


    { from: 'nodo_entrada_A029s_norte', to: 'nodo_escalera_bloque_A_BAJADA_piso0', weight:  getDistanceBetweenPoints('nodo_entrada_A029s_norte','nodo_escalera_bloque_A_BAJADA_piso0', nodosPlanta0) },


    { from: 'nodo_entrada_A029s_norte', to: 'nodo_bloque_A_subida_escalera_1_piso0', weight:  getDistanceBetweenPoints('nodo_entrada_A029s_norte','nodo_bloque_A_subida_escalera_1_piso0', nodosPlanta0) },
    { from: 'nodo_bloque_A_subida_escalera_2_piso0', to: 'nodo_bloque_A_subida_escalera_1_piso0', weight:  getDistanceBetweenPoints('nodo_bloque_A_subida_escalera_2_piso0','nodo_bloque_A_subida_escalera_1_piso0', nodosPlanta0) },
    { from: 'nodo_bloque_A_subida_escalera_2_piso0', to: 'nodo_bloque_A_subida_escalera_3_piso0', weight:  getDistanceBetweenPoints('nodo_bloque_A_subida_escalera_2_piso0','nodo_bloque_A_subida_escalera_3_piso0', nodosPlanta0) },
    { from: 'nodo_escalera_bloque_A_SUBIDA_piso0', to: 'nodo_bloque_A_subida_escalera_3_piso0', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_A_SUBIDA_piso0','nodo_bloque_A_subida_escalera_3_piso0', nodosPlanta0) },



    { from: 'nodo_entrada_A029s_norte', to: 'A030', weight:  getDistanceBetweenPoints('nodo_entrada_A029s_norte','A030', nodosPlanta0)},
    { from: 'nodo_entrada_A029s_norte', to: 'A031', weight: getDistanceBetweenPoints('nodo_entrada_A029s_norte','A031', nodosPlanta0) },
    { from: 'nodo_entrada_A029s_norte', to: 'nodo_second_half_pasillo_A_norte', weight:  getDistanceBetweenPoints('nodo_entrada_A029s_norte','nodo_second_half_pasillo_A_norte', nodosPlanta0) },
    
    { from: 'A029_L1', to: 'A029', weight:  getDistanceBetweenPoints('A029_L1','A029', nodosPlanta0)},
    { from: 'A029_L1', to: 'A029_L2', weight:  getDistanceBetweenPoints('A029_L1','A029_L2', nodosPlanta0) },
    { from: 'A029_L1', to: 'A029_A', weight:  getDistanceBetweenPoints('A029_L1','A029_A', nodosPlanta0)},

    { from: 'nodo_second_half_pasillo_A_norte', to: 'A030', weight:  getDistanceBetweenPoints('nodo_second_half_pasillo_A_norte','A030', nodosPlanta0)},
    { from: 'nodo_second_half_pasillo_A_norte', to: 'A031', weight: getDistanceBetweenPoints('nodo_second_half_pasillo_A_norte','A031', nodosPlanta0) },
    { from: 'nodo_second_half_pasillo_A_norte', to: 'nodo_entrada_A032s_norte', weight:  getDistanceBetweenPoints('nodo_second_half_pasillo_A_norte','nodo_entrada_A032s_norte', nodosPlanta0)},
    { from: 'nodo_second_half_pasillo_A_norte', to: 'B033', weight:  getDistanceBetweenPoints('nodo_second_half_pasillo_A_norte','B033', nodosPlanta0) },
    { from: 'nodo_second_half_pasillo_A_norte', to: 'B034', weight:  getDistanceBetweenPoints('nodo_second_half_pasillo_A_norte','B034', nodosPlanta0) },
    { from: 'nodo_second_half_pasillo_A_norte', to: 'nodo_final_pasillo_A_norte', weight:  getDistanceBetweenPoints('nodo_second_half_pasillo_A_norte','nodo_final_pasillo_A_norte', nodosPlanta0) },
    
    { from: 'nodo_entrada_A032s_norte', to: 'A032', weight:  getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032', nodosPlanta0)},
    { from: 'nodo_entrada_A032s_norte', to: 'A032_L1', weight:  getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032_L1', nodosPlanta0)},
    { from: 'nodo_entrada_A032s_norte', to: 'A032_L2', weight:  getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032_L2', nodosPlanta0) },
    { from: 'nodo_entrada_A032s_norte', to: 'A032_L3', weight:  getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032_L3', nodosPlanta0) },
    { from: 'nodo_entrada_A032s_norte', to: 'A032_L4', weight: getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032_L4', nodosPlanta0) },
    { from: 'nodo_entrada_A032s_norte', to: 'A032_L5', weight:  getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032_L5', nodosPlanta0) },
    { from: 'nodo_entrada_A032s_norte', to: 'A032_L6', weight:  getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032_L6', nodosPlanta0) },
    { from: 'nodo_entrada_A032s_norte', to: 'A032_L7', weight: getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032_L7', nodosPlanta0) },
    { from: 'nodo_entrada_A032s_norte', to: 'A032_A1', weight:  getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032_A1', nodosPlanta0) },

    { from: 'nodo_final_pasillo_A_norte', to: 'B033', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte','B033', nodosPlanta0) },
    { from: 'nodo_final_pasillo_A_norte', to: 'B034', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte','B034', nodosPlanta0) },
    { from: 'nodo_final_pasillo_A_norte', to: 'B036', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte','B036', nodosPlanta0)},
    { from: 'nodo_final_pasillo_A_norte', to: 'B037', weight: getDistanceBetweenPoints('nodo_final_pasillo_A_norte','B037', nodosPlanta0) },
    { from: 'nodo_final_pasillo_A_norte', to: 'nodo_principio_pasillo_B', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte','nodo_principio_pasillo_B', nodosPlanta0)},

    { from: 'nodo_principio_pasillo_B', to: 'B036', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_B','B036', nodosPlanta0)},
    { from: 'nodo_principio_pasillo_B', to: 'B037', weight: getDistanceBetweenPoints('nodo_principio_pasillo_B','B037', nodosPlanta0) },
    { from: 'nodo_principio_pasillo_B', to: 'B01', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_B','B01', nodosPlanta0)},

    { from: 'nodo_principio_pasillo_B', to: 'nodo_escalera_bloque_B_BAJADA_piso0', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_B','nodo_escalera_bloque_B_BAJADA_piso0', nodosPlanta0)},
  
    { from: 'nodo_principio_pasillo_B', to: 'nodo_bloque_B_subida_escalera_1_piso0', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_B','nodo_bloque_B_subida_escalera_1_piso0', nodosPlanta0)},
    { from: 'nodo_bloque_B_subida_escalera_2_piso0', to: 'nodo_bloque_B_subida_escalera_1_piso0', weight:  getDistanceBetweenPoints('nodo_bloque_B_subida_escalera_2_piso0','nodo_bloque_B_subida_escalera_1_piso0', nodosPlanta0)},
    { from: 'nodo_bloque_B_subida_escalera_2_piso0', to: 'nodo_bloque_B_subida_escalera_3_piso0', weight:  getDistanceBetweenPoints('nodo_bloque_B_subida_escalera_2_piso0','nodo_bloque_B_subida_escalera_3_piso0', nodosPlanta0)},
    { from: 'nodo_bloque_B_subida_escalera_3_piso0', to: 'nodo_escalera_bloque_B_SUBIDA_piso0', weight:  getDistanceBetweenPoints('nodo_bloque_B_subida_escalera_3_piso0','nodo_escalera_bloque_B_SUBIDA_piso0', nodosPlanta0)},



    { from: 'nodo_principio_pasillo_B', to: 'nodo_mitad_pasillo_B', weight: getDistanceBetweenPoints('nodo_principio_pasillo_B','nodo_mitad_pasillo_B', nodosPlanta0) },

    { from: 'nodo_mitad_pasillo_B', to: 'B02', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_B','B02', nodosPlanta0)},
    { from: 'nodo_mitad_pasillo_B', to: 'nodo_final_pasillo_B', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_B','nodo_final_pasillo_B', nodosPlanta0)},

    { from: 'nodo_final_pasillo_B', to: 'B02', weight:  getDistanceBetweenPoints('nodo_final_pasillo_B','B02', nodosPlanta0)},
    { from: 'nodo_final_pasillo_B', to: 'nodo_principio_pasillo_asociaciones', weight:  getDistanceBetweenPoints('nodo_final_pasillo_B','nodo_principio_pasillo_asociaciones', nodosPlanta0)},

    { from: 'nodo_principio_pasillo_asociaciones', to: 'B042', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_asociaciones','B042', nodosPlanta0)},
    { from: 'nodo_principio_pasillo_asociaciones', to: 'B041', weight: getDistanceBetweenPoints('nodo_principio_pasillo_asociaciones','B041', nodosPlanta0) },
    { from: 'nodo_principio_pasillo_asociaciones', to: 'nodo_final_pasillo_asociaciones', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_asociaciones','nodo_final_pasillo_asociaciones', nodosPlanta0)},

    { from: 'nodo_final_pasillo_asociaciones', to: 'B042', weight:  getDistanceBetweenPoints('nodo_final_pasillo_asociaciones','B042', nodosPlanta0)},
    { from: 'nodo_final_pasillo_asociaciones', to: 'B041', weight: getDistanceBetweenPoints('nodo_final_pasillo_asociaciones','B041', nodosPlanta0) },

    { from: 'nodo_final_pasillo_asociaciones', to: 'nodo_subida_escalera_bloque_B_secundaria_1_piso0', weight:  getDistanceBetweenPoints('nodo_final_pasillo_asociaciones','nodo_subida_escalera_bloque_B_secundaria_1_piso0', nodosPlanta0)},

    { from: 'nodo_escalera_bloque_B_secundaria_SUBIDA_piso0', to: 'nodo_subida_escalera_bloque_B_secundaria_1_piso0', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_B_secundaria_SUBIDA_piso0','nodo_subida_escalera_bloque_B_secundaria_1_piso0', nodosPlanta0)},

    { from: 'nodo_escalera_bloque_C', to: 'nodo_bloque_C_norte', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_C','nodo_bloque_C_norte', nodosPlanta0)},
    { from: 'nodo_escalera_bloque_C', to: 'C002', weight: getDistanceBetweenPoints('nodo_escalera_bloque_C','C002', nodosPlanta0) },
    { from: 'nodo_escalera_bloque_C', to: 'C003', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_C','C003', nodosPlanta0)},
    { from: 'nodo_escalera_bloque_C', to: 'C004', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_C','C004', nodosPlanta0)},
    { from: 'nodo_escalera_bloque_C', to: 'C005', weight: getDistanceBetweenPoints('nodo_escalera_bloque_C','C005', nodosPlanta0) },
    { from: 'nodo_escalera_bloque_C', to: 'C006', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_C','C006', nodosPlanta0)},
    { from: 'nodo_escalera_bloque_C', to: 'nodo_bloque_C_sur', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_C','nodo_bloque_C_sur', nodosPlanta0)},

    { from: 'nodo_bloque_C_sur', to: 'C006', weight: getDistanceBetweenPoints('nodo_bloque_C_sur','C006', nodosPlanta0) },
    { from: 'nodo_bloque_C_sur', to: 'C007', weight:  getDistanceBetweenPoints('nodo_bloque_C_sur','C007', nodosPlanta0)},

    { from: 'C007', to: 'C008', weight:  getDistanceBetweenPoints('C007','C008', nodosPlanta0)},

    { from: 'C008', to: 'C009', weight: getDistanceBetweenPoints('C008','C009', nodosPlanta0) },

    { from: 'nodo_bloque_C_norte', to: 'C001', weight:  getDistanceBetweenPoints('nodo_bloque_C_norte','C001', nodosPlanta0)},
    { from: 'nodo_bloque_C_norte', to: 'C002', weight:  getDistanceBetweenPoints('nodo_bloque_C_norte','C002', nodosPlanta0)},   
]

todasLasPlantas.planta0 = {}
todasLasPlantas.planta0.nodes = nodosPlanta0
todasLasPlantas.planta0.edges = edgesPlanta0




const nodosPlanta1=[
//laboratorios
{ id: 'A139_L1', latlng: [519.943627, 591.736328], name: 'Lab de medidas eléctricas I' },
{ id: 'A139_L2', latlng: [516.235802, 602.934082], name: 'Lab de medidas eléctricas II' },
{ id: 'A108_L', latlng: [167.943295, 455.095703], name: 'Lab de análisis químico I' },
{ id: 'A110_L', latlng: [168.10913, 497.125977], name: 'Lab de análisis químico II' },
{ id: 'A112_L', latlng: [168.193323, 555.095703], name: 'Lab de análisis químico III' },
{ id: 'A134_L', latlng: [434.179202, 560.444336],  name: 'Lab de informática industrial' },
{ id: 'A133_L', latlng: [428.928617, 585.444336],  name: 'Lab de automatización II' },
{ id: 'A132_L', latlng: [428.428561, 629.694336],  name: 'Lab de automatización III' },
{ id: 'A130_L', latlng: [428.928617, 670.944336],  name: 'Lab de regulación automática' },

//despachos
{ id: 'A140', latlng: [530.786205, 713.844238], name: 'Despacho A 140' },
{ id: 'A139', latlng: [519.534953, 686.983398],  name: 'Despacho A 139' },
{ id: 'A138', latlng: [517.704865, 711.609619],  name: 'Despacho A 138' },
{ id: 'A137', latlng: [501.140521, 711.797119],  name: 'Despacho A 137' },
{ id: 'oficina_internacional', latlng: [651.42291, 696.436035],  name: 'Oficina Internacional' },
{ id: 'B149', latlng: [669.466776, 499.614746], name: 'Despacho B 149' },
{ id: 'B150', latlng: [642.088727, 507.364746],  name: 'Despacho B 150' },
{ id: 'proyecto_mentor', latlng: [409.638454, 712.022949],  name: 'Despacho Proyecto Mentor' },
{ id: 'A129', latlng: [394.818329, 712.136475],  name: 'Despacho A 129' },
{ id: 'A128', latlng: [377.884803, 711.979736],  name: 'Despacho A 128' },
{ id: 'A127', latlng: [360.88291, 712.167236], name: 'Despacho A 127' },
{ id: 'A126', latlng: [345.974512, 711.861328],  name: 'Despacho A 126' },
{ id: 'A125', latlng: [328.777285, 711.959229],  name: 'Despacho A 125' },
{ id: 'A124', latlng: [310.621926, 571.84375], name: 'Despacho A 124' },
{ id: 'A123', latlng: [312.900517, 711.896729],  name: 'Despacho A 123' },
{ id: 'A122', latlng: [296.071739, 711.7146],  name: 'Despacho A 122' },
{ id: 'gestion_economica', latlng: [251.47681, 697.844727],  name: 'Gestión Económica' },
{ id: 'A120', latlng: [146.946392, 743.230469],  name: 'Secretaría y Registro' },
{ id: 'A118', latlng: [148.088261, 714.113281], name: 'Despacho A 118' },
{ id: 'A117', latlng: [147.963247, 665.863281],  name: 'Conserjería' },
{ id: 'oficina_de_practicas', latlng: [158.868937, 657.637207],  name: 'Oficina de prácticas' },
{ id: 'direccion', latlng: [147.963247, 684.863281],  name: 'Dirección' },
{ id: 'A115', latlng: [144.027304, 628.400635],  name: 'Despacho A 115' },
{ id: 'A114', latlng: [183.475098, 611.064453], name: 'Administración' },

//conectar luego solo acceso con ascensor desde le segundo piso
{ id: 'C101', latlng: [467.640017, 422.693359],  name: 'Despacho C 101' },
{ id: 'C102', latlng: [450.263082, 420.443359],  name: 'Despacho C 102' },
{ id: 'C103', latlng: [433.649904, 418.427734],  name: 'Despacho C 103' },
{ id: 'C104', latlng: [416.898039, 416.677734],  name: 'Despacho C 104' },
{ id: 'C105', latlng: [400.665763, 414.797852], name: 'Despacho C 105' },
{ id: 'C106', latlng: [384.079465, 412.095703],  name: 'Despacho C 106' },
{ id: 'C107', latlng: [366.827544, 412.345703],  name: 'Despacho C 107' },
{ id: 'C108', latlng: [345.044598, 412.69751],  name: 'Despacho C 108' },
{ id: 'C109', latlng: [325.979975, 401.44751], name: 'Despacho C 109' },

// //Aulas
{ id: 'A11', latlng: [182.136402, 593.37793],  name: 'A11' },
{ id: 'A12', latlng: [182.136402, 545.87793], name: 'A12' },
{ id: 'A13', latlng: [182.136402, 493.12793],  name: 'A13' },
{ id: 'A14', latlng: [182.636458, 443.87793],  name: 'A14' },
{ id: 'A15', latlng: [167.634788, 428.62793],  name: 'A15' },
{ id: 'A16', latlng: [167.38476, 383.12793], name: 'A16' },
{ id: 'A17', latlng: [167.634788, 346.12793],  name: 'A17' },
{ id: 'A124_S1', latlng: [308.355603, 606.788818],  name: 'Sala de ordenadores' },
{ id: 'B11', latlng: [667.113303, 643.226318],  name: 'B11' },
{ id: 'B12', latlng: [678.051158, 562.976318],  name: 'B12' },

// //Otros
{ id: 'cafeteria', latlng: [176.169565, 304.838867],  name: 'Cafetería' },
{ id: 'comedor', latlng: [200.672293, 280.338867],  name: 'Comedor' },

// //Nodos
{ id: 'nodo_principio_pasillo_A_sur_piso1', latlng: [175.574517, 661.754883],  name: 'nodo principio pasillo A Sur piso 1' },
{ id: 'nodo_principio_pasillo_A_norte_piso1', latlng: [236.134868, 703.31311],  name: 'nodo principio pasillo A Norte piso 1' },
{ id: 'nodo_conserjeria', latlng: [157.784043, 667.127441],  name: 'nodo conserjeria' },
{ id: 'nodo_direccion', latlng: [157.283987, 697.627441], name: 'nodo direccion' },
{ id: 'nodo_secretaria', latlng: [157.602577, 742.78186],  name: 'nodo secretaria' },
{ id: 'nodo_entrada_escaleras_terraza_piso1', latlng: [234.9578, 665.563721],  name: 'nodo entrada escaleras terraza piso 1' },
{ id: 'nodo_entrada_escalera_principal_piso1', latlng: [232.828581, 741.504883],  name: 'nodo entrada escalera principal piso 1' },
{ id: 'nodo_entrada_despachos_A115', latlng: [174.574406, 629.004883],  name: 'nodo entrada despachos A 115' },
{ id: 'nodo_entrada_escalera_secundaria_piso1', latlng: [650.992433, 487.772461],  name: 'nodo entrada escalera secundaria piso 1 ' },
{ id: 'nodo_entrada_despacho_B150', latlng: [653.242683, 507.272461],  name: 'nodo entrada despacho B150' },
{ id: 'nodo_entrada_despacho_B149', latlng: [681.745857, 510.022461], name: 'nodo entrada despacho B149' },
{ id: 'nodo_pasillo_B11_B12', latlng: [684.496163, 648.272461], name: 'nodo pasillo B11 B12' },
{ id: 'nodo_B11_aseos', latlng: [639.057313, 649.706055],  name: 'nodo B11 aseos' },
{ id: 'nodo_salida_escalera_bloque_B_piso1', latlng: [639.807396, 668.706055],  name: 'nodo salida escalera bloque B piso 1' },
{ id: 'nodo_principio_pasillo_B_piso1', latlng: [628.056088, 704.956055],  name: 'nodo pricnipio pasillo B piso 1' },
{ id: 'nodo_final_pasillo_A_norte_piso1', latlng: [534.823197, 703.054688], name: 'nodo final pasillo A Norte piso 1' },
{ id: 'nodo_entrada_A139s_norte', latlng: [518.32136, 702.804688],  name: 'nodo entrada A 139s norte' },
{ id: 'nodo_entrada_escalera_bloque_A_norte_piso1', latlng: [473.956068, 706.341797],  name: 'nodo entrada escalera bloque A norte piso 1' },
{ id: 'nodo_entrada_A130_134_piso1', latlng: [432.539696, 702.484863], name: 'nodo entrada A 130 A134 piso 1' },
{ id: 'nodo_medio_A130_134_piso1', latlng: [434.268492, 632.015381], name: 'nodo medio A 130 A134 piso 1' },
{ id: 'nodo_mitad_pasillo_A_norte_piso1', latlng: [369.440362, 702.948242],  name: 'nodo mitad pasillo A norte piso 1' },
{ id: 'nodo_entrada_A124s_norte', latlng: [311.431323, 700.362305],  name: 'nodo entrada A 124s norte' },
{ id: 'nodo_entrada_escalera_cafeteria_piso1', latlng: [174.64432, 330.657227],  name: 'nodo entrada escalera cafeteria piso 1' },
{ id: 'nodo_final_pasillo_A_sur_piso1', latlng: [174.64725, 415.760742],  name: 'nodo final pasillo A sur piso 1' },
{ id: 'nodo_mitad_pasillo_A_sur_piso1', latlng: [175.647361, 524.260742],  name: 'nodo mitad pasillo A sur piso 1' },
{ id: 'nodo_bloque_C_norte_piso1', latlng: [459.067726, 416.692871],  name: 'nodo bloque C norte piso 1' },
{ id: 'nodo_bloque_C_sur_piso1', latlng: [372.434056, 407.979492],  name: 'nodo bloque C sur piso 1' },


{ id: 'nodo_bloque_A_subida_escalera_3_piso1', latlng: [487.768538, 734.208008],  name: 'nodo bloque A subida escaleras 3 piso 0' },
{ id: 'nodo_bloque_A_subida_escalera_2_piso1', latlng: [464.515949, 735.458008],  name: 'nodo bloque A subida escaleras 2 piso 0' },
{ id: 'nodo_bloque_A_subida_escalera_1_piso1', latlng: [464.631283, 726.875488],  name: 'nodo escalera bloque A subida 1 piso 0' },

{ id: 'nodo_bloque_B_subida_escalera_3_piso1', latlng: [689.061094, 664.0625],  name: 'nodo bloque B subida escaleras 3 piso 1' },
{ id: 'nodo_bloque_B_subida_escalera_2_piso1', latlng: [689.123601, 676.75],  name: 'nodo bloque B subida escaleras 2 piso 1' },
{ id: 'nodo_bloque_B_subida_escalera_1_piso1', latlng: [668.371291, 676.8125],  name: 'nodo escalera bloque B subida 1 piso 1' },

{ id: 'nodo_conexion_entrada_subida_escalera_3_piso1', latlng: [97.54338, 660.842773],  name: 'nodo escalera entrada subida escaleras 3 piso 1' },
{ id: 'nodo_conexion_entrada_subida_escalera_2_piso1', latlng: [97.418366, 670.967773],  name: 'nodo escalera entrada subida escaleras 2 piso 1' },



{ id: 'nodo_conexion_cafeteria_subida_escalera_3_piso1', latlng: [200.23654, 311.324707],  name: 'nodo esclaera cafetria subida escaleras 3 piso 1' },
{ id: 'nodo_conexion_cafeteria_subida_escalera_2_piso1', latlng: [200.309159, 335.347168],  name: 'nodo escalera cafeteria subida escaleras 2 piso 1' },
{ id: 'nodo_conexion_cafeteria_subida_escalera_1_piso1', latlng: [184.269361, 335],  name: 'nodo escalera cafeteria subida escaleras 1 piso 1' },


{ id: 'nodo_conexion_principal_subida_escalera_3_piso1', latlng: [272.00574, 725.628906],  name: 'nodo esclaera principal subida escaleras 3 piso 1' },
{ id: 'nodo_conexion_principal_subida_escalera_2_piso1', latlng: [272.00574, 746.128906],  name: 'nodo escalera principal subida escaleras 2 piso 1' },
{ id: 'nodo_conexion_principal_subida_escalera_1_piso1', latlng: [246.750762, 746.003906],  name: 'nodo escalera principal subida escaleras 1 piso 1' },



{ id: 'nodo_conexion_terraza_subida_escalera_3_piso1', latlng: [257.794412, 650.500977],  name: 'nodo escalera terraza subida 1 piso 1' },
{ id: 'nodo_conexion_terraza_subida_escalera_2_piso1', latlng: [234.916865, 651.000977],  name: 'nodo escalera terraza subida escaleras 2 piso 1' },



{ id: 'nodo_subida_escalera_bloque_B_secundaria_3_piso1', latlng: [614.016403, 484.71582],  name: 'nodo escalera bloque B subida escalera secundaria 3 piso 1' },
{ id: 'nodo_subida_escalera_bloque_B_secundaria_2_piso1', latlng: [612.911046, 493.994629],  name: 'nodo escalera bloque B subida escalera secundaria 2 piso 1' },
{ id: 'nodo_subida_escalera_bloque_B_secundaria_1_piso1', latlng: [634.538454, 493.994629],  name: 'nodo escalera bloque B subida escalera secundaria 1 piso 1' },


{ id: 'nodo_acceso_escalera_cafeteria_piso1', latlng: [177.776215, 321.094727],  name: 'nodo escalera cafeteria piso 1' },
{ id: 'nodo_acceso_escalera_principal_piso1', latlng: [234.620728, 733.445801],  name: 'nodo escalera principal piso 1' },
{ id: 'nodo_acceso_escalera_bloque_C_piso1', latlng: [416.266639, 409.743625],  name: 'nodo escalera bloque C piso 1' },






// //ascensores y/o escaleras



{ id: 'nodo_escalera_principal_SUBIDA_piso1', latlng: [272.00574, 725.628906],  name: 'nodo escalera principal subida piso 1' },
    { id: 'nodo_escalera_principal_BAJADA_piso1', latlng: [247.773326, 726.43457],  name: 'nodo escalera principal bajada piso 1' },
   
    { id: 'nodo_escalera_entrada_SUBIDA_piso1', latlng: [112.23204, 660.499023],  name: 'nodo escalera entrada subida piso 1' },
    { id: 'nodo_escalera_entrada_BAJADA_piso1', latlng: [107.481511, 671.249023],  name: 'nodo escalera entrada subida piso 1' },


    
    { id: 'nodo_escalera_bloque_A_SUBIDA_piso1', latlng: [487.768538, 734.208008],  name: 'nodo escalera bloque A subida piso 1' },
    { id: 'nodo_escalera_bloque_A_BAJADA_piso1', latlng: [486.768427, 718.458008],  name: 'nodo escalera bloque A subida piso 1' },



    { id: 'nodo_escalera_bloque_B_SUBIDA_piso1', latlng: [689.061094, 664.0625],  name: 'nodo escalera bloque B piso 1' },

    { id: 'nodo_escalera_bloque_B_BAJADA_piso1', latlng: [678.497418, 664.4375],  name: 'nodo escalera bloque B piso 1' },





    { id: 'nodo_escaleras_terraza_SUBIDA_piso1', latlng: [257.41937, 641.250977], name: 'nodo escaleras terraza piso 0' },

    { id: 'nodo_escaleras_terraza_BAJADA_piso1', latlng: [234.091715, 641.816406],  name: 'nodo esclaera terraza subida escaleras 3 piso 0' },



    { id: 'nodo_escalera_cafeteria_SUBIDA_piso1', latlng: [200.23654, 311.324707],  name: 'nodo escalera cafeteria piso 1' },

    { id: 'nodo_escalera_cafeteria_BAJADA_piso1', latlng: [185.80602, 310.5],  name: 'nodo escalera cafeteria piso 1' },


   { id: 'nodo_escalera_bloque_B_secundaria_SUBIDA_piso1', latlng: [614.016403, 484.71582],  name: 'nodo escalera bloque B segundaria' },
   { id: 'nodo_escalera_bloque_B_secundaria_BAJADA_piso1', latlng: [630.404609, 484.193359],  name: 'nodo escalera bloque B segundaria' },


   { id: 'nodo_escalera_bloque_C_SUBIDA_piso1', latlng: [433.377257, 411.675781],  name: 'nodo escalera bloque C' },
   { id: 'nodo_escalera_bloque_C_BAJADA_piso1', latlng: [401.7696, 407.882324],  name: 'nodo escalera bloque C' },



]



const edgesPlanta1 = [
{ from: 'nodo_escalera_bloque_B_secundaria_BAJADA_piso1', to: 'nodo_entrada_escalera_secundaria_piso1', weight: getDistanceBetweenPoints('nodo_escalera_bloque_B_secundaria_BAJADA_piso1','nodo_entrada_escalera_secundaria_piso1', nodosPlanta1) },
{ from: 'nodo_subida_escalera_bloque_B_secundaria_1_piso1', to: 'nodo_entrada_escalera_secundaria_piso1', weight: getDistanceBetweenPoints('nodo_subida_escalera_bloque_B_secundaria_1_piso1','nodo_entrada_escalera_secundaria_piso1', nodosPlanta1) },
{ from: 'nodo_subida_escalera_bloque_B_secundaria_1_piso1', to: 'nodo_subida_escalera_bloque_B_secundaria_2_piso1', weight: getDistanceBetweenPoints('nodo_subida_escalera_bloque_B_secundaria_1_piso1','nodo_subida_escalera_bloque_B_secundaria_2_piso1', nodosPlanta1) },
{ from: 'nodo_subida_escalera_bloque_B_secundaria_3_piso1', to: 'nodo_subida_escalera_bloque_B_secundaria_2_piso1', weight: getDistanceBetweenPoints('nodo_subida_escalera_bloque_B_secundaria_3_piso1','nodo_subida_escalera_bloque_B_secundaria_2_piso1', nodosPlanta1) },
{ from: 'nodo_subida_escalera_bloque_B_secundaria_3_piso1', to: 'nodo_escalera_bloque_B_secundaria_SUBIDA_piso1', weight: getDistanceBetweenPoints('nodo_subida_escalera_bloque_B_secundaria_3_piso1','nodo_escalera_bloque_B_secundaria_SUBIDA_piso1', nodosPlanta1) },


{ from: 'nodo_escalera_entrada_BAJADA_piso1', to: 'nodo_conexion_entrada_subida_escalera_2_piso1', weight: getDistanceBetweenPoints('nodo_escalera_entrada_BAJADA_piso1','nodo_conexion_entrada_subida_escalera_2_piso1', nodosPlanta1) },
{ from: 'nodo_conexion_entrada_subida_escalera_3_piso1', to: 'nodo_conexion_entrada_subida_escalera_2_piso1', weight: getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_3_piso1','nodo_conexion_entrada_subida_escalera_2_piso1', nodosPlanta1) },
{ from: 'nodo_conexion_entrada_subida_escalera_3_piso1', to: 'nodo_escalera_entrada_SUBIDA_piso1', weight: getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_3_piso1','nodo_escalera_entrada_SUBIDA_piso1', nodosPlanta1) },


{ from: 'nodo_acceso_escalera_cafeteria_piso1', to: 'nodo_escalera_cafeteria_BAJADA_piso1', weight: getDistanceBetweenPoints('nodo_acceso_escalera_cafeteria_piso1','nodo_escalera_cafeteria_BAJADA_piso1', nodosPlanta1) },
{ from: 'nodo_acceso_escalera_cafeteria_piso1', to: 'nodo_conexion_cafeteria_subida_escalera_1_piso1', weight: getDistanceBetweenPoints('nodo_acceso_escalera_cafeteria_piso1','nodo_conexion_cafeteria_subida_escalera_1_piso1', nodosPlanta1) },
{ from: 'nodo_conexion_cafeteria_subida_escalera_2_piso1', to: 'nodo_conexion_cafeteria_subida_escalera_1_piso1', weight: getDistanceBetweenPoints('nodo_conexion_cafeteria_subida_escalera_2_piso1','nodo_conexion_cafeteria_subida_escalera_1_piso1', nodosPlanta1) },
{ from: 'nodo_conexion_cafeteria_subida_escalera_2_piso1', to: 'nodo_conexion_cafeteria_subida_escalera_3_piso1', weight: getDistanceBetweenPoints('nodo_conexion_cafeteria_subida_escalera_2_piso1','nodo_conexion_cafeteria_subida_escalera_3_piso1', nodosPlanta1) },
{ from: 'nodo_escalera_cafeteria_SUBIDA_piso1', to: 'nodo_conexion_cafeteria_subida_escalera_3_piso1', weight: getDistanceBetweenPoints('nodo_escalera_cafeteria_SUBIDA_piso1','nodo_conexion_cafeteria_subida_escalera_3_piso1', nodosPlanta1) },



{ from: 'nodo_entrada_despacho_B150', to: 'nodo_entrada_escalera_secundaria_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B150','nodo_entrada_escalera_secundaria_piso1', nodosPlanta1)  },
{ from: 'nodo_entrada_despacho_B150', to: 'B150', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B150','B150', nodosPlanta1) },
{ from: 'nodo_entrada_despacho_B150', to: 'B149', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B150','B149', nodosPlanta1)},
{ from: 'nodo_entrada_despacho_B150', to: 'nodo_entrada_despacho_B149', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B150','nodo_entrada_despacho_B149', nodosPlanta1) },

{ from: 'nodo_entrada_despacho_B149', to: 'B149', weight: getDistanceBetweenPoints('nodo_entrada_despacho_B149','B149', nodosPlanta1) },
{ from: 'nodo_entrada_despacho_B149', to: 'B12', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B149','B12', nodosPlanta1) },
{ from: 'nodo_entrada_despacho_B149', to: 'nodo_pasillo_B11_B12', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B149','nodo_pasillo_B11_B12', nodosPlanta1)},

{ from: 'nodo_pasillo_B11_B12', to: 'B12', weight:  getDistanceBetweenPoints('nodo_pasillo_B11_B12','B12', nodosPlanta1)},
{ from: 'nodo_pasillo_B11_B12', to: 'B11', weight:  getDistanceBetweenPoints('nodo_pasillo_B11_B12','B11', nodosPlanta1) },
{ from: 'nodo_pasillo_B11_B12', to: 'nodo_B11_aseos', weight:  getDistanceBetweenPoints('nodo_pasillo_B11_B12','nodo_B11_aseos', nodosPlanta1) },

{ from: 'nodo_B11_aseos', to: 'B11', weight: getDistanceBetweenPoints('nodo_B11_aseos','B11', nodosPlanta1) },
{ from: 'nodo_B11_aseos', to: 'nodo_salida_escalera_bloque_B_piso1', weight:  getDistanceBetweenPoints('nodo_B11_aseos','nodo_salida_escalera_bloque_B_piso1', nodosPlanta1) },


{ from: 'nodo_salida_escalera_bloque_B_piso1', to: 'nodo_escalera_bloque_B_BAJADA_piso1', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso1','nodo_escalera_bloque_B_BAJADA_piso1', nodosPlanta1)},

{ from: 'nodo_salida_escalera_bloque_B_piso1', to: 'nodo_bloque_B_subida_escalera_1_piso1', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso1','nodo_bloque_B_subida_escalera_1_piso1', nodosPlanta1)},
{ from: 'nodo_bloque_B_subida_escalera_2_piso1', to: 'nodo_bloque_B_subida_escalera_1_piso1', weight:  getDistanceBetweenPoints('nodo_bloque_B_subida_escalera_2_piso1','nodo_bloque_B_subida_escalera_1_piso1', nodosPlanta1)},
{ from: 'nodo_bloque_B_subida_escalera_2_piso1', to: 'nodo_bloque_B_subida_escalera_3_piso1', weight:  getDistanceBetweenPoints('nodo_bloque_B_subida_escalera_2_piso1','nodo_bloque_B_subida_escalera_3_piso1', nodosPlanta1)},
{ from: 'nodo_escalera_bloque_B_SUBIDA_piso1', to: 'nodo_bloque_B_subida_escalera_3_piso1', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_B_SUBIDA_piso1','nodo_bloque_B_subida_escalera_3_piso1', nodosPlanta1)},



{ from: 'nodo_salida_escalera_bloque_B_piso1', to: 'nodo_escalera_bloque_B_BAJADA_piso1', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso1','nodo_escalera_bloque_B_BAJADA_piso1', nodosPlanta1)},




{ from: 'nodo_salida_escalera_bloque_B_piso1', to: 'oficina_internacional', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso1','oficina_internacional', nodosPlanta1)},
{ from: 'nodo_salida_escalera_bloque_B_piso1', to: 'nodo_principio_pasillo_B_piso1', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso1','nodo_principio_pasillo_B_piso1', nodosPlanta1)},

{ from: 'nodo_principio_pasillo_B_piso1', to: 'oficina_internacional', weight: getDistanceBetweenPoints('nodo_principio_pasillo_B_piso1','oficina_internacional', nodosPlanta1) },
{ from: 'nodo_principio_pasillo_B_piso1', to: 'nodo_final_pasillo_A_norte_piso1', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_B_piso1','nodo_final_pasillo_A_norte_piso1', nodosPlanta1) },

{ from: 'nodo_final_pasillo_A_norte_piso1', to: 'A140', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte_piso1','A140', nodosPlanta1)},
{ from: 'nodo_final_pasillo_A_norte_piso1', to: 'nodo_entrada_A139s_norte', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte_piso1','nodo_entrada_A139s_norte', nodosPlanta1)},
{ from: 'nodo_final_pasillo_A_norte_piso1', to: 'A138', weight: getDistanceBetweenPoints('nodo_final_pasillo_A_norte_piso1','A138', nodosPlanta1) },

{ from: 'nodo_entrada_A139s_norte', to: 'A140', weight:  getDistanceBetweenPoints('nodo_entrada_A139s_norte','A140', nodosPlanta1) },
{ from: 'nodo_entrada_A139s_norte', to: 'A138', weight:  getDistanceBetweenPoints('nodo_entrada_A139s_norte','A138', nodosPlanta1)},
{ from: 'nodo_entrada_A139s_norte', to: 'A139', weight:  getDistanceBetweenPoints('nodo_entrada_A139s_norte','A139', nodosPlanta1)},
{ from: 'nodo_entrada_A139s_norte', to: 'A137', weight:  getDistanceBetweenPoints('nodo_entrada_A139s_norte','A137', nodosPlanta1)},
{ from: 'nodo_entrada_A139s_norte', to: 'nodo_entrada_escalera_bloque_A_norte_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_A139s_norte','nodo_entrada_escalera_bloque_A_norte_piso1', nodosPlanta1)},

{ from: 'A139', to: 'A139_L1', weight: getDistanceBetweenPoints('A139','A139_L1', nodosPlanta1) },
{ from: 'A139', to: 'A139_L2', weight:  getDistanceBetweenPoints('A139','A139_L2', nodosPlanta1) },
{ from: 'A139_L1', to: 'A139_L2', weight:  getDistanceBetweenPoints('A139_L1','A139_L2', nodosPlanta1)},

{ from: 'nodo_entrada_escalera_bloque_A_norte_piso1', to: 'nodo_escalera_bloque_A_BAJADA_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_piso1','nodo_escalera_bloque_A_BAJADA_piso1', nodosPlanta1) },
{ from: 'nodo_entrada_escalera_bloque_A_norte_piso1', to: 'nodo_bloque_A_subida_escalera_1_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_piso1','nodo_bloque_A_subida_escalera_1_piso1', nodosPlanta1) },
{ from: 'nodo_bloque_A_subida_escalera_2_piso1', to: 'nodo_bloque_A_subida_escalera_1_piso1', weight:  getDistanceBetweenPoints('nodo_bloque_A_subida_escalera_2_piso1','nodo_bloque_A_subida_escalera_1_piso1', nodosPlanta1) },
{ from: 'nodo_bloque_A_subida_escalera_2_piso1', to: 'nodo_bloque_A_subida_escalera_3_piso1', weight:  getDistanceBetweenPoints('nodo_bloque_A_subida_escalera_2_piso1','nodo_bloque_A_subida_escalera_3_piso1', nodosPlanta1) },
{ from: 'nodo_bloque_A_subida_escalera_3_piso1', to: 'nodo_escalera_bloque_A_SUBIDA_piso1', weight:  getDistanceBetweenPoints('nodo_bloque_A_subida_escalera_3_piso1','nodo_escalera_bloque_A_SUBIDA_piso1', nodosPlanta1) },



{ from: 'nodo_entrada_escalera_bloque_A_norte_piso1', to: 'nodo_entrada_A130_134_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_piso1','nodo_entrada_A130_134_piso1', nodosPlanta1)},

{ from: 'nodo_entrada_A130_134_piso1', to: 'nodo_medio_A130_134_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_A130_134_piso1','nodo_medio_A130_134_piso1', nodosPlanta1)},
{ from: 'nodo_entrada_A130_134_piso1', to: 'A130_L', weight:  getDistanceBetweenPoints('nodo_entrada_A130_134_piso1','A130_L', nodosPlanta1)},
{ from: 'nodo_entrada_A130_134_piso1', to: 'A130_L', weight:  getDistanceBetweenPoints('nodo_entrada_A130_134_piso1','A130_L', nodosPlanta1)},


{ from: 'nodo_medio_A130_134_piso1', to: 'A132_L', weight:  getDistanceBetweenPoints('nodo_medio_A130_134_piso1','A132_L', nodosPlanta1)},
{ from: 'nodo_medio_A130_134_piso1', to: 'A133_L', weight:  getDistanceBetweenPoints('nodo_medio_A130_134_piso1','A133_L', nodosPlanta1) },
{ from: 'nodo_medio_A130_134_piso1', to: 'A134_L', weight:  getDistanceBetweenPoints('nodo_medio_A130_134_piso1','A134_L', nodosPlanta1)},
{ from: 'nodo_medio_A130_134_piso1', to: 'A137', weight:  getDistanceBetweenPoints('nodo_medio_A130_134_piso1','A137', nodosPlanta1)},

{ from: 'nodo_entrada_A130_134_piso1', to: 'proyecto_mentor', weight:  getDistanceBetweenPoints('nodo_entrada_A130_134_piso1','proyecto_mentor', nodosPlanta1)},
{ from: 'nodo_entrada_A130_134_piso1', to: 'A129', weight:  getDistanceBetweenPoints('nodo_entrada_A130_134_piso1','A129', nodosPlanta1)},
{ from: 'nodo_entrada_A130_134_piso1', to: 'A128', weight:  getDistanceBetweenPoints('nodo_entrada_A130_134_piso1','A128', nodosPlanta1)},
{ from: 'nodo_entrada_A130_134_piso1', to: 'nodo_mitad_pasillo_A_norte_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_A130_134_piso1','nodo_mitad_pasillo_A_norte_piso1', nodosPlanta1)},

{ from: 'nodo_mitad_pasillo_A_norte_piso1', to: 'proyecto_mentor', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso1','proyecto_mentor', nodosPlanta1)},
{ from: 'nodo_mitad_pasillo_A_norte_piso1', to: 'A129', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso1','A129', nodosPlanta1)},
{ from: 'nodo_mitad_pasillo_A_norte_piso1', to: 'A128', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso1','A128', nodosPlanta1)},
{ from: 'nodo_mitad_pasillo_A_norte_piso1', to: 'A127', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso1','A127', nodosPlanta1)},
{ from: 'nodo_mitad_pasillo_A_norte_piso1', to: 'A126', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso1','A126', nodosPlanta1)},
{ from: 'nodo_mitad_pasillo_A_norte_piso1', to: 'A125', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso1','A125', nodosPlanta1)},
{ from: 'nodo_mitad_pasillo_A_norte_piso1', to: 'A123', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso1','A123', nodosPlanta1)},
{ from: 'nodo_mitad_pasillo_A_norte_piso1', to: 'nodo_entrada_A124s_norte', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso1','nodo_entrada_A124s_norte', nodosPlanta1)},

{ from: 'A124_S1', to: 'A124', weight:  getDistanceBetweenPoints('A124_S1','A124', nodosPlanta1)},

{ from: 'nodo_entrada_A124s_norte', to: 'A124_S1', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','A124_S1', nodosPlanta1)},
{ from: 'nodo_entrada_A124s_norte', to: 'A124', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','A124', nodosPlanta1)},
{ from: 'nodo_entrada_A124s_norte', to: 'A127', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','A127', nodosPlanta1)},
{ from: 'nodo_entrada_A124s_norte', to: 'A126', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','A126', nodosPlanta1)},
{ from: 'nodo_entrada_A124s_norte', to: 'A125', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','A125', nodosPlanta1)},
{ from: 'nodo_entrada_A124s_norte', to: 'A123', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','A123', nodosPlanta1)},
{ from: 'nodo_entrada_A124s_norte', to: 'A122', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','A122', nodosPlanta1)},
{ from: 'nodo_entrada_A124s_norte', to: 'gestion_economica', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','gestion_economica', nodosPlanta1)},
{ from: 'nodo_entrada_A124s_norte', to: 'nodo_principio_pasillo_A_norte_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','nodo_principio_pasillo_A_norte_piso1', nodosPlanta1)},

{ from: 'nodo_principio_pasillo_A_norte_piso1', to: 'gestion_economica', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte_piso1','gestion_economica', nodosPlanta1)},
{ from: 'nodo_principio_pasillo_A_norte_piso1', to: 'nodo_entrada_escalera_principal_piso1', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte_piso1','nodo_entrada_escalera_principal_piso1', nodosPlanta1)},
{ from: 'nodo_principio_pasillo_A_norte_piso1', to: 'nodo_entrada_escaleras_terraza_piso1', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte_piso1','nodo_entrada_escaleras_terraza_piso1', nodosPlanta1)},
{ from: 'nodo_principio_pasillo_A_norte_piso1', to: 'nodo_acceso_escalera_principal_piso1', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte_piso1','nodo_acceso_escalera_principal_piso1', nodosPlanta1)},


{ from: 'nodo_escalera_principal_BAJADA_piso1', to: 'nodo_acceso_escalera_principal_piso1', weight:  getDistanceBetweenPoints('nodo_escalera_principal_BAJADA_piso1','nodo_acceso_escalera_principal_piso1', nodosPlanta1)},

{ from: 'nodo_conexion_principal_subida_escalera_1_piso1', to: 'nodo_acceso_escalera_principal_piso1', weight:  getDistanceBetweenPoints('nodo_conexion_principal_subida_escalera_1_piso1','nodo_acceso_escalera_principal_piso1', nodosPlanta1)},

{ from: 'nodo_conexion_principal_subida_escalera_1_piso1', to: 'nodo_conexion_principal_subida_escalera_2_piso1', weight:  getDistanceBetweenPoints('nodo_conexion_principal_subida_escalera_1_piso1','nodo_conexion_principal_subida_escalera_2_piso1', nodosPlanta1)},
{ from: 'nodo_conexion_principal_subida_escalera_3_piso1', to: 'nodo_conexion_principal_subida_escalera_2_piso1', weight:  getDistanceBetweenPoints('nodo_conexion_principal_subida_escalera_3_piso1','nodo_conexion_principal_subida_escalera_2_piso1', nodosPlanta1)},
{ from: 'nodo_conexion_principal_subida_escalera_3_piso1', to: 'nodo_escalera_principal_SUBIDA_piso1', weight:  getDistanceBetweenPoints('nodo_conexion_principal_subida_escalera_3_piso1','nodo_escalera_principal_SUBIDA_piso1', nodosPlanta1)},



{ from: 'nodo_escaleras_terraza_BAJADA_piso1', to: 'nodo_conexion_terraza_subida_escalera_2_piso1', weight: getDistanceBetweenPoints('nodo_escaleras_terraza_BAJADA_piso1','nodo_conexion_terraza_subida_escalera_2_piso1', nodosPlanta1) },

{ from: 'nodo_conexion_terraza_subida_escalera_3_piso1', to: 'nodo_conexion_terraza_subida_escalera_2_piso1', weight: getDistanceBetweenPoints('nodo_conexion_terraza_subida_escalera_3_piso1','nodo_conexion_terraza_subida_escalera_2_piso1', nodosPlanta1) },

{ from: 'nodo_conexion_terraza_subida_escalera_3_piso1', to: 'nodo_escaleras_terraza_SUBIDA_piso1', weight: getDistanceBetweenPoints('nodo_conexion_terraza_subida_escalera_3_piso1','nodo_escaleras_terraza_SUBIDA_piso1', nodosPlanta1) },





{ from: 'nodo_entrada_escaleras_terraza_piso1', to: 'nodo_conexion_terraza_subida_escalera_2_piso1', weight: getDistanceBetweenPoints('nodo_entrada_escaleras_terraza_piso1','nodo_conexion_terraza_subida_escalera_2_piso1', nodosPlanta1) },
{ from: 'nodo_entrada_escaleras_terraza_piso1', to: 'nodo_principio_pasillo_A_sur_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_escaleras_terraza_piso1','nodo_principio_pasillo_A_sur_piso1', nodosPlanta1) },

{ from: 'nodo_entrada_escalera_principal_piso1', to: 'nodo_secretaria', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_principal_piso1','nodo_secretaria', nodosPlanta1)},
{ from: 'nodo_entrada_escalera_principal_piso1', to: 'nodo_acceso_escalera_principal_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_principal_piso1','nodo_acceso_escalera_principal_piso1', nodosPlanta1)},


{ from: 'nodo_secretaria', to: 'A120', weight:  getDistanceBetweenPoints('nodo_secretaria','A120', nodosPlanta1) },
{ from: 'nodo_secretaria', to: 'A118', weight:  getDistanceBetweenPoints('nodo_secretaria','A118', nodosPlanta1)},
{ from: 'nodo_secretaria', to: 'nodo_direccion', weight:  getDistanceBetweenPoints('nodo_secretaria','nodo_direccion', nodosPlanta1)},

{ from: 'nodo_direccion', to: 'A118', weight:  getDistanceBetweenPoints('nodo_direccion','A118', nodosPlanta1)},
{ from: 'nodo_direccion', to: 'direccion', weight:  getDistanceBetweenPoints('nodo_direccion','direccion', nodosPlanta1) },
{ from: 'nodo_direccion', to: 'nodo_conserjeria', weight:  getDistanceBetweenPoints('nodo_direccion','nodo_conserjeria', nodosPlanta1)},
{ from: 'nodo_direccion', to: 'A117', weight:  getDistanceBetweenPoints('nodo_direccion','A117', nodosPlanta1)},

{ from: 'nodo_conserjeria', to: 'direccion', weight:  getDistanceBetweenPoints('nodo_conserjeria','direccion', nodosPlanta1) },
{ from: 'nodo_conserjeria', to: 'A117', weight:  getDistanceBetweenPoints('nodo_conserjeria','A117', nodosPlanta1)},
{ from: 'nodo_conserjeria', to: 'nodo_principio_pasillo_A_sur_piso1', weight:  getDistanceBetweenPoints('nodo_conserjeria','nodo_principio_pasillo_A_sur_piso1', nodosPlanta1)},

{ from: 'nodo_conserjeria', to: 'oficina_de_practicas', weight:  getDistanceBetweenPoints('nodo_conserjeria','oficina_de_practicas', nodosPlanta1)},

{ from: 'nodo_entrada_despachos_A115', to: 'nodo_principio_pasillo_A_sur_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','nodo_principio_pasillo_A_sur_piso1', nodosPlanta1)},
{ from: 'nodo_entrada_despachos_A115', to: 'A115', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','A115', nodosPlanta1)},
{ from: 'nodo_entrada_despachos_A115', to: 'A114', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','A114', nodosPlanta1) },
{ from: 'nodo_entrada_despachos_A115', to: 'A11', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','A11', nodosPlanta1)},
{ from: 'nodo_entrada_despachos_A115', to: 'A112_L', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','A112_L', nodosPlanta1) },
{ from: 'nodo_entrada_despachos_A115', to: 'A12', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','A12', nodosPlanta1)},
{ from: 'nodo_entrada_despachos_A115', to: 'nodo_mitad_pasillo_A_sur_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','nodo_mitad_pasillo_A_sur_piso1', nodosPlanta1)},

{ from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A114', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A114', nodosPlanta1) },
{ from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A11', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A11', nodosPlanta1)},
{ from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A112_L', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A112_L', nodosPlanta1) },
{ from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A12', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A12', nodosPlanta1)},
{ from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A13', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A13', nodosPlanta1)},
{ from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A110_L', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A110_L', nodosPlanta1)},
{ from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A108_L', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A108_L', nodosPlanta1) },
{ from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A14', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A14', nodosPlanta1)},
{ from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A15', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A15', nodosPlanta1)},
{ from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'nodo_final_pasillo_A_sur_piso1', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','nodo_final_pasillo_A_sur_piso1', nodosPlanta1)},

{ from: 'nodo_final_pasillo_A_sur_piso1', to: 'A13', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A13', nodosPlanta1)},
{ from: 'nodo_final_pasillo_A_sur_piso1', to: 'A110_L', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A110_L', nodosPlanta1)},
{ from: 'nodo_final_pasillo_A_sur_piso1', to: 'A108_L', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A108_L', nodosPlanta1) },
{ from: 'nodo_final_pasillo_A_sur_piso1', to: 'A14', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A14', nodosPlanta1)},
{ from: 'nodo_final_pasillo_A_sur_piso1', to: 'A15', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A15', nodosPlanta1)},
{ from: 'nodo_final_pasillo_A_sur_piso1', to: 'A16', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A16', nodosPlanta1) },
{ from: 'nodo_final_pasillo_A_sur_piso1', to: 'A17', weight: getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A17', nodosPlanta1) },
{ from: 'nodo_final_pasillo_A_sur_piso1', to: 'nodo_entrada_escalera_cafeteria_piso1', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','nodo_entrada_escalera_cafeteria_piso1', nodosPlanta1) },

{ from: 'nodo_entrada_escalera_cafeteria_piso1', to: 'A16', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso1','A16', nodosPlanta1)},
{ from: 'nodo_entrada_escalera_cafeteria_piso1', to: 'A17', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso1','A17', nodosPlanta1) },
{ from: 'nodo_entrada_escalera_cafeteria_piso1', to: 'nodo_acceso_escalera_cafeteria_piso1', weight: getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso1','nodo_acceso_escalera_cafeteria_piso1', nodosPlanta1) },
{ from: 'nodo_entrada_escalera_cafeteria_piso1', to: 'cafeteria', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso1','cafeteria', nodosPlanta1) },

{ from: 'cafeteria', to: 'comedor', weight:  getDistanceBetweenPoints('cafeteria','comedor', nodosPlanta1)},
{ from: 'cafeteria', to: 'nodo_acceso_escalera_cafeteria_piso1', weight: getDistanceBetweenPoints('cafeteria','nodo_acceso_escalera_cafeteria_piso1', nodosPlanta1) }, 



{ from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'nodo_escalera_bloque_C_SUBIDA_piso1', weight:  getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','nodo_escalera_bloque_C_SUBIDA_piso1', nodosPlanta1)},

{ from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'nodo_escalera_bloque_C_BAJADA_piso1', weight:  getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','nodo_escalera_bloque_C_BAJADA_piso1', nodosPlanta1)},





{ from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'nodo_bloque_C_norte_piso1', weight:  getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','nodo_bloque_C_norte_piso1', nodosPlanta1)},
{ from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'C102', weight: getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','C102', nodosPlanta1) },
{ from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'C103', weight:  getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','C103', nodosPlanta1)},
{ from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'C104', weight:  getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','C104', nodosPlanta1)},
{ from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'C105', weight: getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','C105', nodosPlanta1) },
{ from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'C106', weight:  getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','C106', nodosPlanta1)},
{ from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'nodo_bloque_C_sur_piso1', weight:  getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','nodo_bloque_C_sur_piso1', nodosPlanta1)},

{ from: 'nodo_bloque_C_sur_piso1', to: 'C106', weight: getDistanceBetweenPoints('nodo_bloque_C_sur_piso1','C106', nodosPlanta1) },
{ from: 'nodo_bloque_C_sur_piso1', to: 'C107', weight:  getDistanceBetweenPoints('nodo_bloque_C_sur_piso1','C107', nodosPlanta1)},

{ from: 'C107', to: 'C108', weight:  getDistanceBetweenPoints('C107','C108', nodosPlanta1)},

{ from: 'C108', to: 'C109', weight: getDistanceBetweenPoints('C108','C109', nodosPlanta1) },

{ from: 'nodo_bloque_C_norte_piso1', to: 'C101', weight:  getDistanceBetweenPoints('nodo_bloque_C_norte_piso1','C101', nodosPlanta1)},
{ from: 'nodo_bloque_C_norte_piso1', to: 'C102', weight:  getDistanceBetweenPoints('nodo_bloque_C_norte_piso1','C102', nodosPlanta1)},   
]



todasLasPlantas.planta1 = {}
todasLasPlantas.planta1.nodes = nodosPlanta1
todasLasPlantas.planta1.edges = edgesPlanta1



const nodosPlanta2=[
//laboratorios
{ id: 'A239_L', latlng: [519.98622, 641.184082], name: 'Lab de química general' },
{ id: 'B241_L', latlng: [651.42291, 696.436035],  name: 'Lab de regulación de control y procesos químicos' },
{ id: 'A224_L', latlng: [292.785542, 565.447754], name: 'Lab de termodinámica y transmisión de calor' },
{ id: 'A215_L', latlng: [155.539847, 738.46936], name: 'Lab de óptica' },
{ id: 'A211_L', latlng: [157.309326, 622.9375], name: 'Lab de ampliación de física' },
{ id: 'A210_L', latlng: [156.923126, 547.334473], name: 'Lab de física I y II' },
{ id: 'A202_L', latlng: [168.643652, 314.407227], name: 'Lab de electrónica IV' },



//despachos
{ id: 'A238_2', latlng: [534.286595, 714.094238], name: 'Despacho A 238-2' },
{ id: 'A238_1', latlng: [517.704865, 711.609619],  name: 'Despacho A 238-1' },
{ id: 'A238', latlng: [501.140521, 711.797119],  name: 'Despacho A 238' },
{ id: 'A239', latlng: [519.534953, 686.983398],  name: 'Despacho A 239' },
{ id: 'B248', latlng: [669.466776, 499.614746], name: 'Despacho B 248' },
{ id: 'B249', latlng: [642.088727, 507.364746],  name: 'Despacho B 249' },
{ id: 'A233', latlng: [397.693649, 713.761475],  name: 'Despacho A 233' },
{ id: 'A232', latlng: [377.884803, 711.979736],  name: 'Despacho A 232' },
{ id: 'A231', latlng: [360.88291, 712.167236], name: 'Despacho A 231' },
{ id: 'A230', latlng: [345.974512, 711.861328],  name: 'Despacho A 230' },
{ id: 'A229', latlng: [328.777285, 711.959229],  name: 'Despacho A 229' },
{ id: 'A228', latlng: [312.900517, 711.896729],  name: 'Despacho A 228' },
{ id: 'A227', latlng: [296.071739, 711.7146],  name: 'Despacho A 227' },
{ id: 'A225', latlng: [298.870618, 573.34375],  name: 'Despacho A 225' },
{ id: 'A224', latlng: [286.427614, 669.188965],  name: 'Despacho A 224' },
{ id: 'A222_1', latlng: [250.209498, 686.313721], name: 'Despacho A 222-1' },
{ id: 'A222_2', latlng: [231.16316, 685.049805],  name: 'Despacho A 222-2' },
{ id: 'A222_3', latlng: [215.036364, 685.549805],  name: 'Despacho A 222-3' },
{ id: 'A220', latlng: [155.296359, 753.510254],  name: 'Despacho A 220' },
{ id: 'A219', latlng: [143.661853, 757.507324], name: 'Despacho A 219' },
{ id: 'A218', latlng: [136.643023, 760.316162],  name: 'Despacho A 218' },
{ id: 'A217', latlng: [130.079792, 757.128662],  name: 'Despacho A 217' },
{ id: 'sala_de_juntas', latlng: [135.138353, 739.109863], name: 'Sala de juntas' },
{ id: 'A214', latlng: [184.371402, 676.971069],  name: 'Despacho A 214' },
{ id: 'A210', latlng: [127.919897, 542.584473],  name: 'Despacho A 210' },
{ id: 'A206', latlng: [184.549815, 394.303711],  name: 'Despacho A 206' },

//conectar luego solo acceso con ascensor desde le segundo piso
// { id: 'C101', latlng: [467.640017, 422.693359],  name: 'Despacho C 101' },
// { id: 'C102', latlng: [450.263082, 420.443359],  name: 'Despacho C 102' },
// { id: 'C103', latlng: [433.649904, 418.427734],  name: 'Despacho C 103' },
// { id: 'C104', latlng: [416.898039, 416.677734],  name: 'Despacho C 104' },
// { id: 'C105', latlng: [400.665763, 414.797852], name: 'Despacho C 105' },
// { id: 'C106', latlng: [384.079465, 412.095703],  name: 'Despacho C 106' },
// { id: 'C107', latlng: [366.827544, 412.345703],  name: 'Despacho C 107' },
// { id: 'C108', latlng: [345.044598, 412.69751],  name: 'Despacho C 108' },
// { id: 'C109', latlng: [325.979975, 401.44751], name: 'Despacho C 109' },

// //Aulas
{ id: 'A22', latlng: [434.268492, 632.015381], name: 'A22' },
{ id: 'A21', latlng: [430.053742, 642.319336],  name: 'A21' },
{ id: 'ADI2', latlng: [311.431323, 700.362305],  name: 'ADI 2' },

{ id: 'A23', latlng: [297.604406, 635.288818],  name: 'A23' },
{ id: 'A211', latlng: [158.028863, 633.650635], name: 'seminario A211' },
{ id: 'ADI1', latlng: [168.10913, 497.125977],  name: 'ADI 1' },
{ id: 'A208_S', latlng: [167.634788, 428.62793],  name: 'Sala de informática de libre acceso' },
{ id: 'servicios_informaticos', latlng: [167.634788, 346.12793],  name: 'servicios informaticos' },
{ id: 'B21', latlng: [667.113303, 643.226318],  name: 'B21' },
{ id: 'B22', latlng: [678.051158, 562.976318],  name: 'B22' },

// //Otros
{ id: 'salon_de_actos', latlng: [173.231738, 304.901367],  name: 'Salón de actos' },
{ id: 'terraza', latlng: [206.731227, 540.197266],  name: 'Terraza' },

// //Nodos
{ id: 'nodo_principio_pasillo_A_sur_piso2', latlng: [175.378103, 706.06311],  name: 'nodo principio pasillo A sur piso 2' },
{ id: 'nodo_entrada_juntas', latlng: [172.653654, 744.835938], name: 'nodo entrada juntas' },
{ id: 'nodo_entrada_escalera_principal_piso2', latlng: [233.078609, 727.004883],  name: 'nodo entrada escalera principal piso 2' },
{ id: 'nodo_entrada_despachos_A222s', latlng: [250.601713, 706.594727],  name: 'nodo entrada despachos A 222s' },
{ id: 'nodo_entrada_escalera_secundaria_piso2', latlng: [650.992433, 487.772461],  name: 'nodo entrada escalera secundaria piso 2 ' },
{ id: 'nodo_entrada_despacho_B249', latlng: [653.242683, 507.272461],  name: 'nodo entrada despacho B249' },
{ id: 'nodo_entrada_despacho_B248', latlng: [681.745857, 510.022461], name: 'nodo entrada despacho B248' },
{ id: 'nodo_pasillo_B21_B22', latlng: [684.496163, 648.272461], name: 'nodo pasillo B21 B22' },
{ id: 'nodo_B21_aseos', latlng: [639.057313, 649.706055],  name: 'nodo B21 aseos' },
{ id: 'nodo_salida_escalera_bloque_B_piso2', latlng: [639.807396, 668.706055],  name: 'nodo salida escalera bloque B piso 2' },
{ id: 'nodo_principio_pasillo_B_piso2', latlng: [628.056088, 704.956055],  name: 'nodo pricnipio pasillo B piso 2' },
{ id: 'nodo_final_pasillo_A_norte_piso2', latlng: [534.823197, 703.054688], name: 'nodo final pasillo A Norte piso 2' },
{ id: 'nodo_entrada_A239s_norte', latlng: [518.32136, 702.804688],  name: 'nodo entrada A 239s norte' },
{ id: 'nodo_entrada_escalera_bloque_A_norte_piso2', latlng: [473.956068, 706.341797],  name: 'nodo entrada escalera bloque A norte piso 2' },
{ id: 'nodo_entrada_A21_A22_piso2', latlng: [432.539696, 702.484863], name: 'nodo entrada A 21 A 22 piso 2' },
{ id: 'nodo_mitad_pasillo_A_norte_piso2', latlng: [369.440362, 702.948242],  name: 'nodo mitad pasillo A norte piso 2' },
{ id: 'nodo_entrada_escalera_entrada_piso2', latlng: [125.480086, 673.546875], name: 'nodo entrada escalera entrada piso 2' },
{ id: 'nodo_pasillo_escalera_entrada_piso2', latlng: [172.48532, 673.796875],  name: 'nodo pasillo escalera entrada piso 2' },
{ id: 'nodo_entrada_escalera_cafeteria_piso2', latlng: [181.145044, 330.407227],  name: 'nodo entrada escalera cafeteria piso 2' },
{ id: 'nodo_acceso_bloque_C_piso2', latlng: [178.647695, 411.260742],  name: 'nodo acceso bloque C piso 2' },
{ id: 'nodo_mitad_pasillo_A_sur_piso2', latlng: [175.647361, 524.260742],  name: 'nodo mitad pasillo A sur piso 2' },
{ id: 'nodo_entrada_bloque_C_piso2', latlng: [305.193847, 406.133789],  name: 'nodo entrada bloque C piso 2' },
{ id: 'nodo_pasillo_acceso_bloque_C_piso2', latlng: [231.480951, 410.992188],  name: 'nodo pasillo acceso bloque C piso 2' },
{ id: 'nodo_entrada_medio_terraza', latlng: [189.458447, 538.478516],  name: 'nodo entrada medio terraza' },
{ id: 'nodo_entrada_izq_terraza', latlng: [188.058665, 432.308105],  name: 'nodo entrada izq terraza' },
{ id: 'nodo_entrada_dcha_terraza', latlng: [189.288647, 642.729492],  name: 'nodo entrada dcha terraza' },
{ id: 'nodo_terraza_dcha', latlng: [213.666545, 638.776123],  name: 'nodo terraza dcha' },
{ id: 'nodo_entrada_A210s', latlng: [172.601101, 547.812988],  name: 'nodo entrada A210s' },
{ id: 'nodo_entrada_A211s', latlng: [173.699367, 630.192383],  name: 'nodo entrada A211s' },
{ id: 'nodo_entrada_A224s', latlng: [292.264186, 702.45166],  name: 'nodo entrada A224s' },
{ id: 'nodo_sala_juntas_norte', latlng: [155.275226, 746.365234],  name: 'nodo sala juntas norte' },
{ id: 'nodo_sala_juntas_sur', latlng: [137.224901, 748.585938],  name: 'nodo sala juntas sur' },
{ id: 'nodo_entrada_terrza_izq', latlng: [178.488698, 431.75],  name: 'nodo entrada terr izq' },




{ id: 'nodo_bloque_A_subida_escalera_3_piso2', latlng: [487.768538, 734.208008],  name: 'nodo bloque A subida escaleras 3 piso 2' },
{ id: 'nodo_bloque_A_subida_escalera_2_piso2', latlng: [464.515949, 735.458008],  name: 'nodo bloque A subida escaleras 2 piso 2' },
{ id: 'nodo_bloque_A_subida_escalera_1_piso2', latlng: [464.631283, 726.875488],  name: 'nodo escalera bloque A subida 1 piso 2' },

{ id: 'nodo_bloque_B_subida_escalera_3_piso2', latlng: [689.061094, 664.0625],  name: 'nodo bloque B subida escaleras 3 piso 2' },
{ id: 'nodo_bloque_B_subida_escalera_2_piso2', latlng: [689.123601, 676.75],  name: 'nodo bloque B subida escaleras 2 piso 2' },
{ id: 'nodo_bloque_B_subida_escalera_1_piso2', latlng: [668.371291, 676.8125],  name: 'nodo escalera bloque B subida 1 piso 2' },

{ id: 'nodo_conexion_entrada_subida_escalera_3_piso2', latlng: [97.54338, 662.842773],  name: 'nodo esclaera entrada subida escaleras 3 piso 2' },
{ id: 'nodo_conexion_entrada_subida_escalera_2_piso2', latlng: [97.418366, 672.717773],  name: 'nodo escalera entrada subida escaleras 2 piso 2' },
{ id: 'nodo_conexion_entrada_subida_escalera_1_piso2', latlng: [105.856806, 673.124023],  name: 'nodo escalera entrada subida 1 piso 2' },


{ id: 'nodo_conexion_principal_subida_escalera_3_piso2', latlng: [272.00574, 725.628906],  name: 'nodo esclaera principal subida escaleras 3 piso 2' },
{ id: 'nodo_conexion_principal_subida_escalera_2_piso2', latlng: [272.00574, 746.128906],  name: 'nodo escalera principal subida escaleras 2 piso 2' },
{ id: 'nodo_conexion_principal_subida_escalera_1_piso2', latlng: [246.750762, 746.003906],  name: 'nodo escalera principal subida escaleras 1 piso 2' },





{ id: 'nodo_subida_escalera_bloque_B_secundaria_3_piso2', latlng: [614.016403, 484.71582],  name: 'nodo escalera bloque B subida escalera secundaria 3 piso 2' },
{ id: 'nodo_subida_escalera_bloque_B_secundaria_2_piso2', latlng: [612.911046, 493.994629],  name: 'nodo escalera bloque B subida escalera secundaria 2 piso 2' },
{ id: 'nodo_subida_escalera_bloque_B_secundaria_1_piso2', latlng: [634.538454, 493.994629],  name: 'nodo escalera bloque B subida escalera secundaria 1 piso 2' },


{ id: 'nodo_acceso_escalera_entrada_piso2', latlng: [117.650747, 671.258235],  name: 'nodo escalera entrada piso 2' },
    


// //ascensores y/o escaleras
{ id: 'nodo_escalera_cafeteria_piso2', latlng: [186.265582, 313.687988],  name: 'nodo escalera cafeteria piso 2' },
{ id: 'nodo_escaleras_terraza_piso2', latlng: [235.829556, 644.754883], name: 'nodo escaleras terraza piso 2' },
 { id: 'nodo_escalera_bloque_C_piso2', latlng: [417.468578, 414.744141],  name: 'nodo escalera bloque C piso 2' },


{ id: 'nodo_escalera_principal_SUBIDA_piso2', latlng: [272.00574, 725.628906],  name: 'nodo escalera principal subida piso 2' },
    { id: 'nodo_escalera_principal_BAJADA_piso2', latlng: [247.773326, 726.43457],  name: 'nodo escalera principal bajada piso 2' },
   
    { id: 'nodo_escalera_entrada_SUBIDA_piso2', latlng: [97.54338, 662.842773],  name: 'nodo escalera entrada subida piso 2' },
    { id: 'nodo_escalera_entrada_BAJADA_piso2', latlng: [110.607335, 663.499023],  name: 'nodo escalera entrada subida piso 2' },
    
    
    { id: 'nodo_escalera_bloque_A_SUBIDA_piso2', latlng: [487.768538, 734.208008],  name: 'nodo escalera bloque A subida piso 2' },
    { id: 'nodo_escalera_bloque_A_BAJADA_piso2', latlng: [486.768427, 718.458008],  name: 'nodo escalera bloque A subida piso 2' },


    { id: 'nodo_escalera_bloque_B_SUBIDA_piso2', latlng: [689.061094, 664.0625],  name: 'nodo escalera bloque B piso 2' },

    { id: 'nodo_escalera_bloque_B_BAJADA_piso2', latlng: [678.497418, 664.4375],  name: 'nodo escalera bloque B piso 2' },


   { id: 'nodo_escalera_bloque_B_secundaria_SUBIDA_piso2', latlng: [614.016403, 484.71582],  name: 'nodo escalera bloque B segundaria' },
   { id: 'nodo_escalera_bloque_B_secundaria_BAJADA_piso2', latlng: [630.404609, 484.193359],  name: 'nodo escalera bloque B segundaria' },


]



const edgesPlanta2 = [
{ from: 'nodo_escalera_bloque_B_secundaria_BAJADA_piso2', to: 'nodo_entrada_escalera_secundaria_piso2', weight: getDistanceBetweenPoints('nodo_escalera_bloque_B_secundaria_BAJADA_piso2','nodo_entrada_escalera_secundaria_piso2', nodosPlanta2) },


{ from: 'nodo_subida_escalera_bloque_B_secundaria_1_piso2', to: 'nodo_entrada_escalera_secundaria_piso2', weight: getDistanceBetweenPoints('nodo_subida_escalera_bloque_B_secundaria_1_piso2','nodo_entrada_escalera_secundaria_piso2', nodosPlanta2) },

{ from: 'nodo_subida_escalera_bloque_B_secundaria_1_piso2', to: 'nodo_subida_escalera_bloque_B_secundaria_2_piso2', weight: getDistanceBetweenPoints('nodo_subida_escalera_bloque_B_secundaria_1_piso2','nodo_subida_escalera_bloque_B_secundaria_2_piso2', nodosPlanta2) },

{ from: 'nodo_subida_escalera_bloque_B_secundaria_3_piso2', to: 'nodo_subida_escalera_bloque_B_secundaria_2_piso2', weight: getDistanceBetweenPoints('nodo_subida_escalera_bloque_B_secundaria_3_piso2','nodo_subida_escalera_bloque_B_secundaria_2_piso2', nodosPlanta2) },

{ from: 'nodo_subida_escalera_bloque_B_secundaria_3_piso2', to: 'nodo_escalera_bloque_B_secundaria_SUBIDA_piso2', weight: getDistanceBetweenPoints('nodo_subida_escalera_bloque_B_secundaria_3_piso2','nodo_escalera_bloque_B_secundaria_SUBIDA_piso2', nodosPlanta2) },



{ from: 'nodo_entrada_despacho_B249', to: 'nodo_entrada_escalera_secundaria_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B249','nodo_entrada_escalera_secundaria_piso2', nodosPlanta2)  },
{ from: 'nodo_entrada_despacho_B249', to: 'B249', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B249','B249', nodosPlanta2) },
{ from: 'nodo_entrada_despacho_B249', to: 'B248', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B249','B248', nodosPlanta2)},
{ from: 'nodo_entrada_despacho_B249', to: 'nodo_entrada_despacho_B248', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B249','nodo_entrada_despacho_B248', nodosPlanta2) },

{ from: 'nodo_entrada_despacho_B248', to: 'B248', weight: getDistanceBetweenPoints('nodo_entrada_despacho_B248','B248', nodosPlanta2) },
{ from: 'nodo_entrada_despacho_B248', to: 'B22', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B248','B22', nodosPlanta2) },
{ from: 'nodo_entrada_despacho_B248', to: 'nodo_pasillo_B21_B22', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B248','nodo_pasillo_B21_B22', nodosPlanta2)},

{ from: 'nodo_pasillo_B21_B22', to: 'B22', weight:  getDistanceBetweenPoints('nodo_pasillo_B21_B22','B22', nodosPlanta2)},
{ from: 'nodo_pasillo_B21_B22', to: 'B21', weight:  getDistanceBetweenPoints('nodo_pasillo_B21_B22','B21', nodosPlanta2) },
{ from: 'nodo_pasillo_B21_B22', to: 'nodo_B21_aseos', weight:  getDistanceBetweenPoints('nodo_pasillo_B21_B22','nodo_B21_aseos', nodosPlanta2) },

{ from: 'nodo_B21_aseos', to: 'B21', weight: getDistanceBetweenPoints('nodo_B21_aseos','B21', nodosPlanta2) },
{ from: 'nodo_B21_aseos', to: 'nodo_salida_escalera_bloque_B_piso2', weight:  getDistanceBetweenPoints('nodo_B21_aseos','nodo_salida_escalera_bloque_B_piso2', nodosPlanta2) },

{ from: 'nodo_salida_escalera_bloque_B_piso2', to: 'nodo_bloque_B_subida_escalera_1_piso2', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso2','nodo_bloque_B_subida_escalera_1_piso2', nodosPlanta2)},

{ from: 'nodo_bloque_B_subida_escalera_2_piso2', to: 'nodo_bloque_B_subida_escalera_1_piso2', weight:  getDistanceBetweenPoints('nodo_bloque_B_subida_escalera_2_piso2','nodo_bloque_B_subida_escalera_1_piso2', nodosPlanta2)},

{ from: 'nodo_bloque_B_subida_escalera_2_piso2', to: 'nodo_bloque_B_subida_escalera_3_piso2', weight:  getDistanceBetweenPoints('nodo_bloque_B_subida_escalera_2_piso2','nodo_bloque_B_subida_escalera_3_piso2', nodosPlanta2)},


{ from: 'nodo_escalera_bloque_B_SUBIDA_piso2', to: 'nodo_bloque_B_subida_escalera_3_piso2', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_B_SUBIDA_piso2','nodo_bloque_B_subida_escalera_3_piso2', nodosPlanta2)},


{ from: 'nodo_salida_escalera_bloque_B_piso2', to: 'nodo_escalera_bloque_B_BAJADA_piso2', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso2','nodo_escalera_bloque_B_BAJADA_piso2', nodosPlanta2)},


{ from: 'nodo_salida_escalera_bloque_B_piso2', to: 'B241_L', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso2','B241_L', nodosPlanta2)},
{ from: 'nodo_salida_escalera_bloque_B_piso2', to: 'nodo_principio_pasillo_B_piso2', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso2','nodo_principio_pasillo_B_piso2', nodosPlanta2)},

{ from: 'nodo_principio_pasillo_B_piso2', to: 'B241_L', weight: getDistanceBetweenPoints('nodo_principio_pasillo_B_piso2','B241_L', nodosPlanta2) },
{ from: 'nodo_principio_pasillo_B_piso2', to: 'nodo_final_pasillo_A_norte_piso2', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_B_piso2','nodo_final_pasillo_A_norte_piso2', nodosPlanta2) },

{ from: 'nodo_final_pasillo_A_norte_piso2', to: 'A238_2', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte_piso2','A238_2', nodosPlanta2)},
{ from: 'nodo_final_pasillo_A_norte_piso2', to: 'A238_1', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte_piso2','A238_1', nodosPlanta2)},
{ from: 'nodo_final_pasillo_A_norte_piso2', to: 'nodo_entrada_A239s_norte', weight: getDistanceBetweenPoints('nodo_final_pasillo_A_norte_piso2','nodo_entrada_A239s_norte', nodosPlanta2) },

{ from: 'nodo_entrada_A239s_norte', to: 'A238_2', weight:  getDistanceBetweenPoints('nodo_entrada_A239s_norte','A238_2', nodosPlanta2) },
{ from: 'nodo_entrada_A239s_norte', to: 'A238_1', weight:  getDistanceBetweenPoints('nodo_entrada_A239s_norte','A238_1', nodosPlanta2)},
{ from: 'nodo_entrada_A239s_norte', to: 'A238', weight:  getDistanceBetweenPoints('nodo_entrada_A239s_norte','A238', nodosPlanta2)},
{ from: 'nodo_entrada_A239s_norte', to: 'A239', weight:  getDistanceBetweenPoints('nodo_entrada_A239s_norte','A239', nodosPlanta2)},
{ from: 'nodo_entrada_A239s_norte', to: 'nodo_entrada_escalera_bloque_A_norte_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_A239s_norte','nodo_entrada_escalera_bloque_A_norte_piso2', nodosPlanta2)},

{ from: 'A239_L', to: 'A239', weight:  getDistanceBetweenPoints('A239_L','A239', nodosPlanta2)},


{ from: 'nodo_entrada_escalera_bloque_A_norte_piso2', to: 'nodo_escalera_bloque_A_BAJADA_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_piso2','nodo_escalera_bloque_A_BAJADA_piso2', nodosPlanta2) },

{ from: 'nodo_entrada_escalera_bloque_A_norte_piso2', to: 'nodo_bloque_A_subida_escalera_1_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_piso2','nodo_bloque_A_subida_escalera_1_piso2', nodosPlanta2) },

{ from: 'nodo_bloque_A_subida_escalera_2_piso2', to: 'nodo_bloque_A_subida_escalera_1_piso2', weight:  getDistanceBetweenPoints('nodo_bloque_A_subida_escalera_2_piso2','nodo_bloque_A_subida_escalera_1_piso2', nodosPlanta2) },

{ from: 'nodo_bloque_A_subida_escalera_2_piso2', to: 'nodo_bloque_A_subida_escalera_3_piso2', weight:  getDistanceBetweenPoints('nodo_bloque_A_subida_escalera_2_piso2','nodo_bloque_A_subida_escalera_3_piso2', nodosPlanta2) },

{ from: 'nodo_escalera_bloque_A_SUBIDA_piso2', to: 'nodo_bloque_A_subida_escalera_3_piso2', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_A_SUBIDA_piso2','nodo_bloque_A_subida_escalera_3_piso2', nodosPlanta2) },






{ from: 'nodo_entrada_escalera_bloque_A_norte_piso2', to: 'A238', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_piso2','A238', nodosPlanta2)},
{ from: 'nodo_entrada_escalera_bloque_A_norte_piso2', to: 'nodo_entrada_A21_A22_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_piso2','nodo_entrada_A21_A22_piso2', nodosPlanta2)},

{ from: 'A22', to: 'A21', weight:  getDistanceBetweenPoints('A22','A21', nodosPlanta2)},

{ from: 'nodo_entrada_A21_A22_piso2', to: 'A21', weight:  getDistanceBetweenPoints('nodo_entrada_A21_A22_piso2','A21', nodosPlanta2)},
{ from: 'nodo_entrada_A21_A22_piso2', to: 'A22', weight:  getDistanceBetweenPoints('nodo_entrada_A21_A22_piso2','A22', nodosPlanta2)},
{ from: 'nodo_entrada_A21_A22_piso2', to: 'A233', weight:  getDistanceBetweenPoints('nodo_entrada_A21_A22_piso2','A233', nodosPlanta2)},
{ from: 'nodo_entrada_A21_A22_piso2', to: 'A232', weight:  getDistanceBetweenPoints('nodo_entrada_A21_A22_piso2','A232', nodosPlanta2)},
{ from: 'nodo_entrada_A21_A22_piso2', to: 'nodo_mitad_pasillo_A_norte_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_A21_A22_piso2','nodo_mitad_pasillo_A_norte_piso2', nodosPlanta2)},



{ from: 'nodo_mitad_pasillo_A_norte_piso2', to: 'A233', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso2','A233', nodosPlanta2)},
{ from: 'nodo_mitad_pasillo_A_norte_piso2', to: 'A232', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso2','A232', nodosPlanta2)},
{ from: 'nodo_mitad_pasillo_A_norte_piso2', to: 'A231', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso2','A231', nodosPlanta2)},
{ from: 'nodo_mitad_pasillo_A_norte_piso2', to: 'A230', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso2','A230', nodosPlanta2)},
{ from: 'nodo_mitad_pasillo_A_norte_piso2', to: 'A229', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso2','A229', nodosPlanta2)},
{ from: 'nodo_mitad_pasillo_A_norte_piso2', to: 'A228', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso2','A228', nodosPlanta2)},
{ from: 'nodo_mitad_pasillo_A_norte_piso2', to: 'A227', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso2','A227', nodosPlanta2)},
{ from: 'nodo_mitad_pasillo_A_norte_piso2', to: 'ADI2', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso2','ADI2', nodosPlanta2)},
{ from: 'nodo_mitad_pasillo_A_norte_piso2', to: 'nodo_entrada_A224s', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso2','nodo_entrada_A224s', nodosPlanta2)},


{ from: 'nodo_entrada_A224s', to: 'A231', weight:  getDistanceBetweenPoints('nodo_entrada_A224s','A231', nodosPlanta2)},
{ from: 'nodo_entrada_A224s', to: 'A230', weight:  getDistanceBetweenPoints('nodo_entrada_A224s','A230', nodosPlanta2)},
{ from: 'nodo_entrada_A224s', to: 'A229', weight:  getDistanceBetweenPoints('nodo_entrada_A224s','A229', nodosPlanta2)},
{ from: 'nodo_entrada_A224s', to: 'A228', weight:  getDistanceBetweenPoints('nodo_entrada_A224s','A228', nodosPlanta2)},
{ from: 'nodo_entrada_A224s', to: 'A227', weight:  getDistanceBetweenPoints('nodo_entrada_A224s','A227', nodosPlanta2)},
{ from: 'nodo_entrada_A224s', to: 'ADI2', weight:  getDistanceBetweenPoints('nodo_entrada_A224s','ADI2', nodosPlanta2)},
{ from: 'nodo_entrada_A224s', to: 'A224', weight:  getDistanceBetweenPoints('nodo_entrada_A224s','A224', nodosPlanta2)},
{ from: 'nodo_entrada_A224s', to: 'A23', weight:  getDistanceBetweenPoints('nodo_entrada_A224s','A23', nodosPlanta2)},
{ from: 'nodo_entrada_A224s', to: 'A225', weight:  getDistanceBetweenPoints('nodo_entrada_A224s','A225', nodosPlanta2)},
{ from: 'nodo_entrada_A224s', to: 'A224_L', weight:  getDistanceBetweenPoints('nodo_entrada_A224s','A224_L', nodosPlanta2)},
{ from: 'nodo_entrada_A224s', to: 'nodo_entrada_despachos_A222s', weight:  getDistanceBetweenPoints('nodo_entrada_A224s','nodo_entrada_despachos_A222s', nodosPlanta2)},

{ from: 'A224_L', to: 'A225', weight:  getDistanceBetweenPoints('A224_L','A225', nodosPlanta2)},
{ from: 'A224_L', to: 'A224', weight:  getDistanceBetweenPoints('A224_L','A224', nodosPlanta2)},

{ from: 'A224', to: 'A23', weight:  getDistanceBetweenPoints('A224','A23', nodosPlanta2)},

{ from: 'nodo_entrada_despachos_A222s', to: 'A222_1', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A222s','A222_1', nodosPlanta2)},
{ from: 'nodo_entrada_despachos_A222s', to: 'nodo_entrada_escalera_principal_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A222s','nodo_entrada_escalera_principal_piso2', nodosPlanta2)},
{ from: 'nodo_entrada_despachos_A222s', to: 'nodo_principio_pasillo_A_sur_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A222s','nodo_principio_pasillo_A_sur_piso2', nodosPlanta2)},

{ from: 'nodo_entrada_escalera_principal_piso2', to: 'nodo_escalera_principal_BAJADA_piso2', weight: getDistanceBetweenPoints('nodo_entrada_escalera_principal_piso2','nodo_escalera_principal_BAJADA_piso2', nodosPlanta2) },


{ from: 'nodo_entrada_escalera_principal_piso2', to: 'nodo_conexion_principal_subida_escalera_1_piso2', weight: getDistanceBetweenPoints('nodo_entrada_escalera_principal_piso2','nodo_conexion_principal_subida_escalera_1_piso2', nodosPlanta2) },

{ from: 'nodo_conexion_principal_subida_escalera_2_piso2', to: 'nodo_conexion_principal_subida_escalera_1_piso2', weight: getDistanceBetweenPoints('nodo_conexion_principal_subida_escalera_2_piso2','nodo_conexion_principal_subida_escalera_1_piso2', nodosPlanta2) },

{ from: 'nodo_conexion_principal_subida_escalera_2_piso2', to: 'nodo_conexion_principal_subida_escalera_3_piso2', weight: getDistanceBetweenPoints('nodo_conexion_principal_subida_escalera_2_piso2','nodo_conexion_principal_subida_escalera_3_piso2', nodosPlanta2) },

{ from: 'nodo_escalera_principal_SUBIDA_piso2', to: 'nodo_conexion_principal_subida_escalera_3_piso2', weight: getDistanceBetweenPoints('nodo_escalera_principal_SUBIDA_piso2','nodo_conexion_principal_subida_escalera_3_piso2', nodosPlanta2) },





{ from: 'nodo_entrada_escalera_principal_piso2', to: 'nodo_entrada_juntas', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_principal_piso2','nodo_entrada_juntas', nodosPlanta2) },
{ from: 'nodo_entrada_escalera_principal_piso2', to: 'nodo_principio_pasillo_A_sur_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_principal_piso2','nodo_principio_pasillo_A_sur_piso2', nodosPlanta2) },

{ from: 'A222_1', to: 'A222_2', weight:  getDistanceBetweenPoints('A222_1','A222_2', nodosPlanta2)},
{ from: 'A222_2', to: 'A222_3', weight:  getDistanceBetweenPoints('A222_2','A222_3', nodosPlanta2)},

{ from: 'nodo_sala_juntas_norte', to: 'nodo_entrada_juntas', weight:  getDistanceBetweenPoints('nodo_sala_juntas_norte','nodo_entrada_juntas', nodosPlanta2) },
{ from: 'nodo_sala_juntas_norte', to: 'A215_L', weight:  getDistanceBetweenPoints('nodo_sala_juntas_norte','A215_L', nodosPlanta2) },
{ from: 'nodo_sala_juntas_norte', to: 'A220', weight:  getDistanceBetweenPoints('nodo_sala_juntas_norte','A220', nodosPlanta2)},
{ from: 'nodo_sala_juntas_norte', to: 'sala_de_juntas', weight:  getDistanceBetweenPoints('nodo_sala_juntas_norte','sala_de_juntas', nodosPlanta2)},
{ from: 'nodo_sala_juntas_norte', to: 'nodo_sala_juntas_sur', weight:  getDistanceBetweenPoints('nodo_sala_juntas_norte','nodo_sala_juntas_sur', nodosPlanta2)},


{ from: 'nodo_sala_juntas_sur', to: 'A219', weight:  getDistanceBetweenPoints('nodo_sala_juntas_sur','A219', nodosPlanta2)},
{ from: 'nodo_sala_juntas_sur', to: 'A218', weight:  getDistanceBetweenPoints('nodo_sala_juntas_sur','A218', nodosPlanta2) },
{ from: 'nodo_sala_juntas_sur', to: 'A217', weight:  getDistanceBetweenPoints('nodo_sala_juntas_sur','A217', nodosPlanta2)},
{ from: 'nodo_sala_juntas_sur', to: 'sala_de_juntas', weight:  getDistanceBetweenPoints('nodo_sala_juntas_sur','sala_de_juntas', nodosPlanta2)},

{ from: 'nodo_principio_pasillo_A_sur_piso2', to: 'nodo_entrada_juntas', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur_piso2','nodo_entrada_juntas', nodosPlanta2) },
{ from: 'nodo_principio_pasillo_A_sur_piso2', to: 'A214', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur_piso2','A214', nodosPlanta2)},
{ from: 'nodo_principio_pasillo_A_sur_piso2', to: 'nodo_pasillo_escalera_entrada_piso2', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur_piso2','nodo_pasillo_escalera_entrada_piso2', nodosPlanta2)},

{ from: 'nodo_pasillo_escalera_entrada_piso2', to: 'A214', weight:  getDistanceBetweenPoints('nodo_pasillo_escalera_entrada_piso2','A214', nodosPlanta2)},
{ from: 'nodo_pasillo_escalera_entrada_piso2', to: 'nodo_entrada_escalera_entrada_piso2', weight:  getDistanceBetweenPoints('nodo_pasillo_escalera_entrada_piso2','nodo_entrada_escalera_entrada_piso2', nodosPlanta2)},
{ from: 'nodo_pasillo_escalera_entrada_piso2', to: 'nodo_entrada_A211s', weight:  getDistanceBetweenPoints('nodo_pasillo_escalera_entrada_piso2','nodo_entrada_A211s', nodosPlanta2) },
{ from: 'nodo_pasillo_escalera_entrada_piso2', to: 'nodo_entrada_dcha_terraza', weight:  getDistanceBetweenPoints('nodo_pasillo_escalera_entrada_piso2','nodo_entrada_dcha_terraza', nodosPlanta2)},

{ from: 'nodo_entrada_escalera_entrada_piso2', to: 'nodo_acceso_escalera_entrada_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_entrada_piso2','nodo_acceso_escalera_entrada_piso2', nodosPlanta2) },

{ from: 'nodo_escalera_entrada_BAJADA_piso2', to: 'nodo_acceso_escalera_entrada_piso2', weight:  getDistanceBetweenPoints('nodo_escalera_entrada_BAJADA_piso2','nodo_acceso_escalera_entrada_piso2', nodosPlanta2) },

{ from: 'nodo_conexion_entrada_subida_escalera_1_piso2', to: 'nodo_acceso_escalera_entrada_piso2', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_1_piso2','nodo_acceso_escalera_entrada_piso2', nodosPlanta2) },

{ from: 'nodo_conexion_entrada_subida_escalera_1_piso2', to: 'nodo_conexion_entrada_subida_escalera_2_piso2', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_1_piso2','nodo_conexion_entrada_subida_escalera_2_piso2', nodosPlanta2) },

{ from: 'nodo_conexion_entrada_subida_escalera_3_piso2', to: 'nodo_conexion_entrada_subida_escalera_2_piso2', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_3_piso2','nodo_conexion_entrada_subida_escalera_2_piso2', nodosPlanta2) },

{ from: 'nodo_conexion_entrada_subida_escalera_3_piso2', to: 'nodo_escalera_entrada_SUBIDA_piso2', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_3_piso2','nodo_escalera_entrada_SUBIDA_piso2', nodosPlanta2) },





{ from: 'nodo_entrada_A211s', to: 'nodo_entrada_dcha_terraza', weight:  getDistanceBetweenPoints('nodo_entrada_A211s','nodo_entrada_dcha_terraza', nodosPlanta2) },
{ from: 'nodo_entrada_A211s', to: 'A211', weight:  getDistanceBetweenPoints('nodo_entrada_A211s','A211', nodosPlanta2)},
{ from: 'nodo_entrada_A211s', to: 'A211_L', weight:  getDistanceBetweenPoints('nodo_entrada_A211s','A211_L', nodosPlanta2)},
{ from: 'nodo_entrada_A211s', to: 'nodo_entrada_A210s', weight:  getDistanceBetweenPoints('nodo_entrada_A211s','nodo_entrada_A210s', nodosPlanta2)},

{ from: 'nodo_entrada_A210s', to: 'A210_L', weight:  getDistanceBetweenPoints('nodo_entrada_A210s','A210_L', nodosPlanta2) },
{ from: 'nodo_entrada_A210s', to: 'nodo_mitad_pasillo_A_sur_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_A210s','nodo_mitad_pasillo_A_sur_piso2', nodosPlanta2)},
{ from: 'nodo_entrada_A210s', to: 'nodo_entrada_medio_terraza', weight:  getDistanceBetweenPoints('nodo_entrada_A210s','nodo_entrada_medio_terraza', nodosPlanta2) },

{ from: 'A210', to: 'A210_L', weight:  getDistanceBetweenPoints('A210','A210_L', nodosPlanta2)},

{ from: 'nodo_mitad_pasillo_A_sur_piso2', to: 'nodo_entrada_medio_terraza', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso2','nodo_entrada_medio_terraza', nodosPlanta2)},
{ from: 'nodo_mitad_pasillo_A_sur_piso2', to: 'ADI1', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso2','ADI1', nodosPlanta2)},
{ from: 'nodo_mitad_pasillo_A_sur_piso2', to: 'A208_S', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso2','A208_S', nodosPlanta2) },
{ from: 'nodo_mitad_pasillo_A_sur_piso2', to: 'nodo_entrada_terrza_izq', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso2','nodo_entrada_terrza_izq', nodosPlanta2)},

{ from: 'nodo_entrada_terrza_izq', to: 'nodo_acceso_bloque_C_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_terrza_izq','nodo_acceso_bloque_C_piso2', nodosPlanta2)},
{ from: 'nodo_entrada_terrza_izq', to: 'A208_S', weight:  getDistanceBetweenPoints('nodo_entrada_terrza_izq','A208_S', nodosPlanta2)},
{ from: 'nodo_entrada_terrza_izq', to: 'nodo_entrada_izq_terraza', weight:  getDistanceBetweenPoints('nodo_entrada_terrza_izq','nodo_entrada_izq_terraza', nodosPlanta2)},
{ from: 'nodo_entrada_terrza_izq', to: 'ADI1', weight:  getDistanceBetweenPoints('nodo_entrada_terrza_izq','ADI1', nodosPlanta2)},

{ from: 'nodo_acceso_bloque_C_piso2', to: 'A206', weight:  getDistanceBetweenPoints('nodo_acceso_bloque_C_piso2','A206', nodosPlanta2) },
{ from: 'nodo_acceso_bloque_C_piso2', to: 'servicios_informaticos', weight:  getDistanceBetweenPoints('nodo_acceso_bloque_C_piso2','servicios_informaticos', nodosPlanta2)},
{ from: 'nodo_acceso_bloque_C_piso2', to: 'nodo_entrada_escalera_cafeteria_piso2', weight:  getDistanceBetweenPoints('nodo_acceso_bloque_C_piso2','nodo_entrada_escalera_cafeteria_piso2', nodosPlanta2)},

{ from: 'nodo_entrada_escalera_cafeteria_piso2', to: 'A202_L', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso2','A202_L', nodosPlanta2) },
{ from: 'nodo_entrada_escalera_cafeteria_piso2', to: 'salon_de_actos', weight: getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso2','salon_de_actos', nodosPlanta2) },
{ from: 'nodo_entrada_escalera_cafeteria_piso2', to: 'nodo_escalera_cafeteria_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso2','nodo_escalera_cafeteria_piso2', nodosPlanta2) },
{ from: 'nodo_entrada_escalera_cafeteria_piso2', to: 'servicios_informaticos', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso2','servicios_informaticos', nodosPlanta2) },
{ from: 'nodo_entrada_escalera_cafeteria_piso2', to: 'A206', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso2','A206', nodosPlanta2) },


{ from: 'terraza', to: 'nodo_terraza_dcha', weight:  getDistanceBetweenPoints('terraza','nodo_terraza_dcha', nodosPlanta2)},
{ from: 'terraza', to: 'nodo_entrada_dcha_terraza', weight:  getDistanceBetweenPoints('terraza','nodo_entrada_dcha_terraza', nodosPlanta2) },
{ from: 'terraza', to: 'nodo_entrada_medio_terraza', weight: getDistanceBetweenPoints('terraza','nodo_entrada_medio_terraza', nodosPlanta2) },
{ from: 'terraza', to: 'nodo_entrada_izq_terraza', weight:  getDistanceBetweenPoints('terraza','nodo_entrada_izq_terraza', nodosPlanta2) },

{ from: 'nodo_terraza_dcha', to: 'nodo_escaleras_terraza_piso2', weight:  getDistanceBetweenPoints('nodo_terraza_dcha','nodo_escaleras_terraza_piso2', nodosPlanta2)},
{ from: 'nodo_terraza_dcha', to: 'nodo_entrada_dcha_terraza', weight: getDistanceBetweenPoints('nodo_terraza_dcha','nodo_entrada_dcha_terraza', nodosPlanta2) }, 

{ from: 'nodo_acceso_bloque_C_piso2', to: 'nodo_pasillo_acceso_bloque_C_piso2', weight: getDistanceBetweenPoints('nodo_acceso_bloque_C_piso2','nodo_pasillo_acceso_bloque_C_piso2', nodosPlanta2) }, 

{ from: 'nodo_entrada_bloque_C_piso2', to: 'nodo_pasillo_acceso_bloque_C_piso2', weight: getDistanceBetweenPoints('nodo_entrada_bloque_C_piso2','nodo_pasillo_acceso_bloque_C_piso2', nodosPlanta2) }, 
{ from: 'nodo_entrada_bloque_C_piso2', to: 'nodo_escalera_bloque_C_piso2', weight: getDistanceBetweenPoints('nodo_entrada_bloque_C_piso2','nodo_escalera_bloque_C_piso2', nodosPlanta2) }, 



//     { from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'nodo_bloque_C_norte_piso1', weight:  getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','nodo_bloque_C_norte_piso1', nodosPlanta2)},
//     { from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'C102', weight: getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','C102', nodosPlanta2) },
//     { from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'C103', weight:  getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','C103', nodosPlanta2)},
//     { from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'C104', weight:  getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','C104', nodosPlanta2)},
//     { from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'C105', weight: getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','C105', nodosPlanta2) },
//     { from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'C106', weight:  getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','C106', nodosPlanta2)},
//     { from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'nodo_bloque_C_sur_piso1', weight:  getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','nodo_bloque_C_sur_piso1', nodosPlanta2)},

//     { from: 'nodo_bloque_C_sur_piso1', to: 'C106', weight: getDistanceBetweenPoints('nodo_bloque_C_sur_piso1','C106', nodosPlanta2) },
//     { from: 'nodo_bloque_C_sur_piso1', to: 'C107', weight:  getDistanceBetweenPoints('nodo_bloque_C_sur_piso1','C107', nodosPlanta2)},

]



todasLasPlantas.planta2 = {}
todasLasPlantas.planta2.nodes = nodosPlanta2
todasLasPlantas.planta2.edges = edgesPlanta2


const nodosPlanta3=[
//laboratorios
{ id: 'A324_L', latlng: [518.278894, 630.256348], name: 'Lab de teoría de mécanismos síntesis y simulación de mecanismos diseño de máquinas' },
{ id: 'EG1_EG2', latlng: [304.180516, 700.112305],  name: 'EG1 y EG2' },
{ id: 'EG3', latlng: [398.359364, 623.891602],  name: 'EG3' },
{ id: 'EG4', latlng: [399.359475, 690.891602],  name: 'EG4' },
{ id: 'A309_L', latlng: [233.663438, 700.424805], name: 'Lab de fabricación aditiva y digitalización industrial' },
{ id: 'A305_L', latlng: [182.020584, 744.163086], name: 'Ecolab' },
{ id: 'A303_L', latlng: [166.41582, 691.514648], name: 'Lab de ampliación de física' },
{ id: 'ADIpi', latlng: [165.915764, 737.014648], name: 'ADI π' },

//despachos
{ id: 'B335', latlng: [669.466776, 499.614746], name: 'Despacho B 335' },
{ id: 'B336', latlng: [642.088727, 507.364746],  name: 'Despacho B 336' },
{ id: 'B328_S', latlng: [651.42291, 696.436035],  name: 'Sala polivalente' },
{ id: 'A326', latlng: [517.704865, 711.609619],  name: 'Despacho A 326' },
{ id: 'A325', latlng: [501.140521, 711.797119],  name: 'Despacho A 325' },
{ id: 'A324', latlng: [519.534953, 686.983398],  name: 'Despacho A 324' },
{ id: 'A324_S', latlng: [523.343417, 669.117676],  name: 'Sala de reuniones' },
{ id: 'A320', latlng: [392.693092, 713.761475],  name: 'Despacho A 320' },
{ id: 'A318', latlng: [398.376037, 638.788574],  name: 'Sala de control' },
{ id: 'A317', latlng: [377.884803, 711.979736],  name: 'Despacho A 317' },
{ id: 'A316', latlng: [345.974512, 711.861328],  name: 'Despacho A 316' },
{ id: 'A315', latlng: [328.777285, 711.959229],  name: 'Despacho A 315' },
{ id: 'A314', latlng: [296.071739, 711.7146],  name: 'Despacho A 314' },
{ id: 'A311_1', latlng: [296.408532, 611.268555],  name: 'Despacho A 311-1' },
{ id: 'A311_2', latlng: [296.408532, 611.268555],  name: 'Despacho A 311-2' },
{ id: 'A308', latlng: [213.536197, 700.174805],  name: 'Despacho A 308' },
{ id: 'A308_1', latlng: [213.536197, 700.174805],  name: 'Despacho A 308-1' },
{ id: 'A302_1', latlng: [192.872349, 699.971069],  name: 'Despacho A 302-1' },
{ id: 'A307', latlng: [225.401879, 744.870605], name: 'Despacho A 307' },
{ id: 'A305', latlng: [174.144707, 752.788086],  name: 'Despacho A 305' },

// //Aulas

{ id: 'A31', latlng: [288.657669, 603.268555],  name: 'A31' },
{ id: 'A32', latlng: [392.858752, 581.141602],  name: 'A32' },
{ id: 'A301_S3', latlng: [168.10913, 497.125977],  name: 'Sala de trabajo 2.2' },
{ id: 'A301_S2', latlng: [168.10913, 497.125977],  name: 'Sala de trabajo 2.1' },
{ id: 'A301_S1', latlng: [163.518209, 524.220459],  name: 'Sala de trabajo 1' },
{ id: 'A301_S4', latlng: [167.634788, 428.62793],  name: 'Biblioteca' },
{ id: 'B31', latlng: [667.113303, 643.226318],  name: 'B31' },
{ id: 'B32', latlng: [678.051158, 562.976318],  name: 'B32' },

// //Otros

// //Nodos
{ id: 'nodo_entrada_escalera_secundaria_piso3', latlng: [650.992433, 487.772461],  name: 'nodo entrada escalera secundaria piso 3 ' },
{ id: 'nodo_entrada_despacho_B336', latlng: [653.242683, 507.272461],  name: 'nodo entrada despacho B336' },
{ id: 'nodo_principio_pasillo_A_sur_piso3', latlng: [175.378103, 706.06311],  name: 'nodo principio pasillo A sur piso 3' },
{ id: 'nodo_adipi_piso3', latlng: [174.966412, 729.085938], name: 'nodo adi π piso 3' },
{ id: 'nodo_entrada_escalera_principal_piso3', latlng: [233.078609, 727.004883],  name: 'nodo entrada escalera principal piso 3' },
{ id: 'nodo_final_pasilloA_piso3', latlng: [250.601713, 706.594727],  name: 'nodo final pasillo A piso 3' },
{ id: 'nodo_entrada_despacho_B335', latlng: [681.745857, 510.022461], name: 'nodo entrada despacho B335' },
{ id: 'nodo_pasillo_B31_B32', latlng: [684.496163, 648.272461], name: 'nodo pasillo B31 B32' },
{ id: 'nodo_B31_aseos', latlng: [639.057313, 649.706055],  name: 'nodo B31 aseos' },
{ id: 'nodo_salida_escalera_bloque_B_piso3', latlng: [639.807396, 668.706055],  name: 'nodo salida escalera bloque B piso 3' },
{ id: 'nodo_principio_pasillo_B_piso3', latlng: [628.056088, 704.956055],  name: 'nodo pricnipio pasillo B piso 3' },
{ id: 'nodo_final_pasillo_A_norte_piso3', latlng: [534.823197, 703.054688], name: 'nodo final pasillo A Norte piso 3' },
{ id: 'nodo_entrada_A324s_norte', latlng: [518.32136, 702.804688],  name: 'nodo entrada A 324s norte' },
{ id: 'nodo_entrada_escalera_bloque_A_norte_piso3', latlng: [473.956068, 706.341797],  name: 'nodo entrada escalera bloque A norte piso 3' },
{ id: 'nodo_zona_hall_piso3', latlng: [208.049683, 716.562988],  name: 'nodo zona hall piso 3' },
{ id: 'nodo_entrada_escalera_entrada_piso3', latlng: [125.480086, 673.546875], name: 'nodo entrada escalera entrada piso 3' },
{ id: 'nodo_pasillo_escalera_entrada_piso3', latlng: [172.48532, 673.796875],  name: 'nodo pasillo escalera entrada piso 3' },
{ id: 'nodo_entrada_sala_trabajo1', latlng: [175.937857, 524.360352],  name: 'nodo entrada sala de trabajo 1 piso 3' },
{ id: 'nodo_entrada_sala_trabajo2', latlng: [176.860104, 497.125977],  name: 'nodo entrada sala de trabajo 2 piso 3' },
{ id: 'nodo_entrada_biblioteca', latlng: [174.427081, 429.333984],  name: 'nodo entrada biblio piso 3' },
{ id: 'nodo_entrada_A311s', latlng: [292.264186, 702.45166],  name: 'nodo entrada A311s' },
{ id: 'nodo_entrada_eg3_4', latlng: [395.017406, 705.779297],  name: 'nodo entrada eg 3 4' },
{ id: 'nodo_pasilloA_piso3', latlng: [318.368344, 706.666992],  name: 'nodo pasillo A piso 3' },
{ id: 'nodo_hall2_piso3', latlng: [232.740978, 711.830566],  name: 'nodo hall 2 piso 3' },



{ id: 'nodo_conexion_entrada_subida_escalera_3_piso3', latlng: [97.54338, 662.842773],  name: 'nodo esclaera entrada subida escaleras 3 piso 3' },
{ id: 'nodo_conexion_entrada_subida_escalera_2_piso3', latlng: [97.418366, 672.717773],  name: 'nodo escalera entrada subida escaleras 2 piso 3' },
{ id: 'nodo_conexion_entrada_subida_escalera_1_piso3', latlng: [105.856806, 673.124023],  name: 'nodo escalera entrada subida 1 piso 3' },


{ id: 'nodo_conexion_principal_subida_escalera_3_piso3', latlng: [272.00574, 725.628906],  name: 'nodo esclaera principal subida escaleras 3 piso 3' },
{ id: 'nodo_conexion_principal_subida_escalera_2_piso3', latlng: [272.00574, 746.128906],  name: 'nodo escalera principal subida escaleras 2 piso 3' },
{ id: 'nodo_conexion_principal_subida_escalera_1_piso3', latlng: [246.750762, 746.003906],  name: 'nodo escalera principal subida escaleras 1 piso 3' },

{ id: 'nodo_acceso_escalera_entrada_piso3', latlng: [116.587231, 670.947353],  name: 'nodo escalera entrada piso 3' },



// //ascensores y/o escaleras

{ id: 'nodo_escalera_bloque_A_piso3', latlng: [486.018279, 724.333008],  name: 'nodo escalera bloque A subida piso 3' },
{ id: 'nodo_escalera_bloque_B_piso3', latlng: [678.497418, 664.4375],  name: 'nodo escalera bloque B piso 3' },
{ id: 'nodo_escalera_bloque_B_secundaria_piso3', latlng: [630.404609, 484.193359],  name: 'nodo escalera bloque B secundaria piso 3' },



{ id: 'nodo_escalera_principal_SUBIDA_piso3', latlng: [272.00574, 725.628906],  name: 'nodo escalera principal subida piso 3' },
    { id: 'nodo_escalera_principal_BAJADA_piso3', latlng: [247.773326, 726.43457],  name: 'nodo escalera principal bajada piso 3' },
   

    { id: 'nodo_escalera_entrada_SUBIDA_piso3', latlng: [97.54338, 662.842773],  name: 'nodo escalera entrada subida piso 2' },
    { id: 'nodo_escalera_entrada_BAJADA_piso3', latlng: [110.607335, 663.499023],  name: 'nodo escalera entrada subida piso 2' },
    
  
]



const edgesPlanta3 = [
{ from: 'nodo_escalera_bloque_B_secundaria_piso3', to: 'nodo_entrada_escalera_secundaria_piso3', weight: getDistanceBetweenPoints('nodo_escalera_bloque_B_secundaria_piso3','nodo_entrada_escalera_secundaria_piso3', nodosPlanta3) },

{ from: 'nodo_entrada_despacho_B336', to: 'nodo_entrada_escalera_secundaria_piso3', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B336','nodo_entrada_escalera_secundaria_piso3', nodosPlanta3)  },
{ from: 'nodo_entrada_despacho_B336', to: 'B336', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B336','B336', nodosPlanta3) },
{ from: 'nodo_entrada_despacho_B336', to: 'B335', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B336','B335', nodosPlanta3)},
{ from: 'nodo_entrada_despacho_B336', to: 'nodo_entrada_despacho_B335', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B336','nodo_entrada_despacho_B335', nodosPlanta3) },

{ from: 'nodo_entrada_despacho_B335', to: 'B335', weight: getDistanceBetweenPoints('nodo_entrada_despacho_B335','B335', nodosPlanta3) },
{ from: 'nodo_entrada_despacho_B335', to: 'B32', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B335','B32', nodosPlanta3) },
{ from: 'nodo_entrada_despacho_B335', to: 'nodo_pasillo_B31_B32', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B335','nodo_pasillo_B31_B32', nodosPlanta3)},

{ from: 'nodo_pasillo_B31_B32', to: 'B32', weight:  getDistanceBetweenPoints('nodo_pasillo_B31_B32','B32', nodosPlanta3) },
{ from: 'nodo_pasillo_B31_B32', to: 'B31', weight:  getDistanceBetweenPoints('nodo_pasillo_B31_B32','B31', nodosPlanta3)},
{ from: 'nodo_pasillo_B31_B32', to: 'nodo_B31_aseos', weight:  getDistanceBetweenPoints('nodo_pasillo_B31_B32','nodo_B31_aseos', nodosPlanta3) },

{ from: 'nodo_B31_aseos', to: 'B31', weight: getDistanceBetweenPoints('nodo_B31_aseos','B31', nodosPlanta3) },
{ from: 'nodo_B31_aseos', to: 'nodo_salida_escalera_bloque_B_piso3', weight:  getDistanceBetweenPoints('nodo_B31_aseos','nodo_salida_escalera_bloque_B_piso3', nodosPlanta3) },

{ from: 'nodo_salida_escalera_bloque_B_piso3', to: 'nodo_escalera_bloque_B_piso3', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso3','nodo_escalera_bloque_B_piso3', nodosPlanta3)},
{ from: 'nodo_salida_escalera_bloque_B_piso3', to: 'B328_S', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso3','B328_S', nodosPlanta3)},
{ from: 'nodo_salida_escalera_bloque_B_piso3', to: 'nodo_principio_pasillo_B_piso3', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso3','nodo_principio_pasillo_B_piso3', nodosPlanta3)},

{ from: 'nodo_principio_pasillo_B_piso3', to: 'B328_S', weight: getDistanceBetweenPoints('nodo_principio_pasillo_B_piso3','B328_S', nodosPlanta3) },
{ from: 'nodo_principio_pasillo_B_piso3', to: 'nodo_final_pasillo_A_norte_piso3', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_B_piso3','nodo_final_pasillo_A_norte_piso3', nodosPlanta3) },

{ from: 'nodo_final_pasillo_A_norte_piso3', to: 'A326', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte_piso3','A326', nodosPlanta3)},
{ from: 'nodo_final_pasillo_A_norte_piso3', to: 'nodo_entrada_A324s_norte', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte_piso3','nodo_entrada_A324s_norte', nodosPlanta3)},

{ from: 'nodo_entrada_A324s_norte', to: 'A324', weight:  getDistanceBetweenPoints('nodo_entrada_A324s_norte','A324', nodosPlanta3) },
{ from: 'nodo_entrada_A324s_norte', to: 'A326', weight:  getDistanceBetweenPoints('nodo_entrada_A324s_norte','A326', nodosPlanta3)},
{ from: 'nodo_entrada_A324s_norte', to: 'A325', weight:  getDistanceBetweenPoints('nodo_entrada_A324s_norte','A325', nodosPlanta3)},
{ from: 'nodo_entrada_A324s_norte', to: 'nodo_entrada_escalera_bloque_A_norte_piso3', weight:  getDistanceBetweenPoints('nodo_entrada_A324s_norte','nodo_entrada_escalera_bloque_A_norte_piso3', nodosPlanta3)},

{ from: 'A324_S', to: 'A324', weight:  getDistanceBetweenPoints('A324_S','A324', nodosPlanta3)},
{ from: 'A324_L', to: 'A324', weight:  getDistanceBetweenPoints('A324_L','A324', nodosPlanta3)},


{ from: 'nodo_entrada_escalera_bloque_A_norte_piso3', to: 'nodo_escalera_bloque_A_piso3', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_piso3','nodo_escalera_bloque_A_piso3', nodosPlanta3) },
{ from: 'nodo_entrada_escalera_bloque_A_norte_piso3', to: 'A325', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_piso3','A325', nodosPlanta3)},
{ from: 'nodo_entrada_escalera_bloque_A_norte_piso3', to: 'nodo_entrada_eg3_4', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_piso3','nodo_entrada_eg3_4', nodosPlanta3)},


{ from: 'nodo_entrada_eg3_4', to: 'EG4', weight:  getDistanceBetweenPoints('nodo_entrada_eg3_4','EG4', nodosPlanta3)},
{ from: 'nodo_entrada_eg3_4', to: 'A318', weight:  getDistanceBetweenPoints('nodo_entrada_eg3_4','A318', nodosPlanta3)},
{ from: 'nodo_entrada_eg3_4', to: 'EG3', weight:  getDistanceBetweenPoints('nodo_entrada_eg3_4','EG3', nodosPlanta3)},
{ from: 'nodo_entrada_eg3_4', to: 'A32', weight:  getDistanceBetweenPoints('nodo_entrada_eg3_4','A32', nodosPlanta3)},
{ from: 'nodo_entrada_eg3_4', to: 'A320', weight:  getDistanceBetweenPoints('nodo_entrada_eg3_4','A320', nodosPlanta3)},
{ from: 'nodo_entrada_eg3_4', to: 'A317', weight:  getDistanceBetweenPoints('nodo_entrada_eg3_4','A317', nodosPlanta3)},
{ from: 'nodo_entrada_eg3_4', to: 'A316', weight:  getDistanceBetweenPoints('nodo_entrada_eg3_4','A316', nodosPlanta3)},
{ from: 'nodo_entrada_eg3_4', to: 'A315', weight:  getDistanceBetweenPoints('nodo_entrada_eg3_4','A315', nodosPlanta3)},
{ from: 'nodo_entrada_eg3_4', to: 'nodo_pasilloA_piso3', weight:  getDistanceBetweenPoints('nodo_entrada_eg3_4','nodo_pasilloA_piso3', nodosPlanta3)},


{ from: 'nodo_pasilloA_piso3', to: 'A317', weight:  getDistanceBetweenPoints('nodo_pasilloA_piso3','A317', nodosPlanta3)},
{ from: 'nodo_pasilloA_piso3', to: 'A316', weight:  getDistanceBetweenPoints('nodo_pasilloA_piso3','A316', nodosPlanta3)},
{ from: 'nodo_pasilloA_piso3', to: 'A315', weight:  getDistanceBetweenPoints('nodo_pasilloA_piso3','A315', nodosPlanta3)},
{ from: 'nodo_pasilloA_piso3', to: 'A314', weight:  getDistanceBetweenPoints('nodo_pasilloA_piso3','A314', nodosPlanta3)},
{ from: 'nodo_pasilloA_piso3', to: 'EG1_EG2', weight:  getDistanceBetweenPoints('nodo_pasilloA_piso3','EG1_EG2', nodosPlanta3)},
{ from: 'nodo_pasilloA_piso3', to: 'nodo_entrada_A311s', weight:  getDistanceBetweenPoints('nodo_pasilloA_piso3','nodo_entrada_A311s', nodosPlanta3)},

{ from: 'nodo_entrada_A311s', to: 'A314', weight:  getDistanceBetweenPoints('nodo_entrada_A311s','A314', nodosPlanta3)},
{ from: 'nodo_entrada_A311s', to: 'EG1_EG2', weight:  getDistanceBetweenPoints('nodo_entrada_A311s','EG1_EG2', nodosPlanta3)},
{ from: 'nodo_entrada_A311s', to: 'A311_2', weight:  getDistanceBetweenPoints('nodo_entrada_A311s','A311_2', nodosPlanta3)},
{ from: 'nodo_entrada_A311s', to: 'A311_1', weight:  getDistanceBetweenPoints('nodo_entrada_A311s','A311_1', nodosPlanta3)},
{ from: 'nodo_entrada_A311s', to: 'A31', weight:  getDistanceBetweenPoints('nodo_entrada_A311s','A31', nodosPlanta3)},
{ from: 'nodo_entrada_A311s', to: 'nodo_final_pasilloA_piso3', weight:  getDistanceBetweenPoints('nodo_entrada_A311s','nodo_final_pasilloA_piso3', nodosPlanta3)},


{ from: 'nodo_final_pasilloA_piso3', to: 'A309_L', weight:  getDistanceBetweenPoints('nodo_final_pasilloA_piso3','A309_L', nodosPlanta3)},
{ from: 'nodo_final_pasilloA_piso3', to: 'nodo_hall2_piso3', weight:  getDistanceBetweenPoints('nodo_final_pasilloA_piso3','nodo_hall2_piso3', nodosPlanta3)},

{ from: 'nodo_hall2_piso3', to: 'A309_L', weight:  getDistanceBetweenPoints('nodo_hall2_piso3','A309_L', nodosPlanta3)},
{ from: 'nodo_hall2_piso3', to: 'nodo_entrada_escalera_principal_piso3', weight:  getDistanceBetweenPoints('nodo_hall2_piso3','nodo_entrada_escalera_principal_piso3', nodosPlanta3)},
{ from: 'nodo_hall2_piso3', to: 'A308_1', weight:  getDistanceBetweenPoints('nodo_hall2_piso3','A308_1', nodosPlanta3)},
{ from: 'nodo_hall2_piso3', to: 'A308', weight:  getDistanceBetweenPoints('nodo_hall2_piso3','A308', nodosPlanta3)},
{ from: 'nodo_hall2_piso3', to: 'nodo_zona_hall_piso3', weight:  getDistanceBetweenPoints('nodo_hall2_piso3','nodo_zona_hall_piso3', nodosPlanta3)},

{ from: 'nodo_entrada_escalera_principal_piso3', to: 'A307', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_principal_piso3','A307', nodosPlanta3)},


{ from: 'nodo_entrada_escalera_principal_piso3', to: 'nodo_escalera_principal_BAJADA_piso3', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_principal_piso3','nodo_escalera_principal_BAJADA_piso3', nodosPlanta3)},
{ from: 'nodo_entrada_escalera_principal_piso3', to: 'nodo_conexion_principal_subida_escalera_1_piso3', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_principal_piso3','nodo_conexion_principal_subida_escalera_1_piso3', nodosPlanta3)},
{ from: 'nodo_conexion_principal_subida_escalera_2_piso3', to: 'nodo_conexion_principal_subida_escalera_1_piso3', weight:  getDistanceBetweenPoints('nodo_conexion_principal_subida_escalera_2_piso3','nodo_conexion_principal_subida_escalera_1_piso3', nodosPlanta3)},
{ from: 'nodo_conexion_principal_subida_escalera_2_piso3', to: 'nodo_conexion_principal_subida_escalera_3_piso3', weight:  getDistanceBetweenPoints('nodo_conexion_principal_subida_escalera_2_piso3','nodo_conexion_principal_subida_escalera_3_piso3', nodosPlanta3)},
{ from: 'nodo_escalera_principal_SUBIDA_piso3', to: 'nodo_conexion_principal_subida_escalera_3_piso3', weight:  getDistanceBetweenPoints('nodo_escalera_principal_SUBIDA_piso3','nodo_conexion_principal_subida_escalera_3_piso3', nodosPlanta3)},




{ from: 'nodo_entrada_escalera_principal_piso3', to: 'nodo_zona_hall_piso3', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_principal_piso3','nodo_zona_hall_piso3', nodosPlanta3)},


{ from: 'nodo_zona_hall_piso3', to: 'A308_1', weight:  getDistanceBetweenPoints('nodo_zona_hall_piso3','A308_1', nodosPlanta3)},
{ from: 'nodo_zona_hall_piso3', to: 'A308', weight:  getDistanceBetweenPoints('nodo_zona_hall_piso3','A308', nodosPlanta3)},
{ from: 'nodo_zona_hall_piso3', to: 'A302_1', weight:  getDistanceBetweenPoints('nodo_zona_hall_piso3','A302_1', nodosPlanta3)},
{ from: 'nodo_zona_hall_piso3', to: 'nodo_adipi_piso3', weight:  getDistanceBetweenPoints('nodo_zona_hall_piso3','nodo_adipi_piso3', nodosPlanta3)},
{ from: 'nodo_zona_hall_piso3', to: 'nodo_principio_pasillo_A_sur_piso3', weight:  getDistanceBetweenPoints('nodo_zona_hall_piso3','nodo_principio_pasillo_A_sur_piso3', nodosPlanta3)},

{ from: 'nodo_adipi_piso3', to: 'A305_L', weight:  getDistanceBetweenPoints('nodo_adipi_piso3','A305_L', nodosPlanta3)},
{ from: 'nodo_adipi_piso3', to: 'A305', weight:  getDistanceBetweenPoints('nodo_adipi_piso3','A305', nodosPlanta3)},
{ from: 'nodo_adipi_piso3', to: 'ADIpi', weight:  getDistanceBetweenPoints('nodo_adipi_piso3','ADIpi', nodosPlanta3)},
{ from: 'nodo_adipi_piso3', to: 'nodo_principio_pasillo_A_sur_piso3', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur_piso3','nodo_adipi_piso3', nodosPlanta3)},

{ from: 'nodo_principio_pasillo_A_sur_piso3', to: 'A302_1', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur_piso3','A302_1', nodosPlanta3)},
{ from: 'nodo_principio_pasillo_A_sur_piso3', to: 'A303_L', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur_piso3','A303_L', nodosPlanta3)},
{ from: 'nodo_principio_pasillo_A_sur_piso3', to: 'nodo_pasillo_escalera_entrada_piso3', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur_piso3','nodo_pasillo_escalera_entrada_piso3', nodosPlanta3)},

{ from: 'nodo_pasillo_escalera_entrada_piso3', to: 'nodo_entrada_sala_trabajo1', weight:  getDistanceBetweenPoints('nodo_pasillo_escalera_entrada_piso3','nodo_entrada_sala_trabajo1', nodosPlanta3)},
{ from: 'nodo_pasillo_escalera_entrada_piso3', to: 'nodo_entrada_escalera_entrada_piso3', weight:  getDistanceBetweenPoints('nodo_pasillo_escalera_entrada_piso3','nodo_entrada_escalera_entrada_piso3', nodosPlanta3)},
{ from: 'nodo_pasillo_escalera_entrada_piso3', to: 'A303_L', weight:  getDistanceBetweenPoints('nodo_pasillo_escalera_entrada_piso3','A303_L', nodosPlanta3)},

{ from: 'nodo_entrada_escalera_entrada_piso3', to: 'nodo_acceso_escalera_entrada_piso3', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_entrada_piso3','nodo_acceso_escalera_entrada_piso3', nodosPlanta3)},

{ from: 'nodo_escalera_entrada_BAJADA_piso3', to: 'nodo_acceso_escalera_entrada_piso3', weight:  getDistanceBetweenPoints('nodo_escalera_entrada_BAJADA_piso3','nodo_acceso_escalera_entrada_piso3', nodosPlanta3)},

{ from: 'nodo_conexion_entrada_subida_escalera_1_piso3', to: 'nodo_acceso_escalera_entrada_piso3', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_1_piso3','nodo_acceso_escalera_entrada_piso3', nodosPlanta3)},
{ from: 'nodo_conexion_entrada_subida_escalera_1_piso3', to: 'nodo_conexion_entrada_subida_escalera_2_piso3', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_1_piso3','nodo_conexion_entrada_subida_escalera_2_piso3', nodosPlanta3)},
{ from: 'nodo_conexion_entrada_subida_escalera_3_piso3', to: 'nodo_conexion_entrada_subida_escalera_2_piso3', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_3_piso3','nodo_conexion_entrada_subida_escalera_2_piso3', nodosPlanta3)},
{ from: 'nodo_conexion_entrada_subida_escalera_3_piso3', to: 'nodo_escalera_entrada_SUBIDA_piso3', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_3_piso3','nodo_escalera_entrada_SUBIDA_piso3', nodosPlanta3)},



{ from: 'nodo_entrada_sala_trabajo1', to: 'A301_S1', weight:  getDistanceBetweenPoints('nodo_entrada_sala_trabajo1','A301_S1', nodosPlanta3)},
{ from: 'nodo_entrada_sala_trabajo1', to: 'nodo_entrada_sala_trabajo2', weight:  getDistanceBetweenPoints('nodo_entrada_sala_trabajo1','nodo_entrada_sala_trabajo2', nodosPlanta3)},


{ from: 'nodo_entrada_sala_trabajo2', to: 'A301_S2', weight: getDistanceBetweenPoints('nodo_entrada_sala_trabajo2','A301_S2', nodosPlanta3) },
{ from: 'nodo_entrada_sala_trabajo2', to: 'A301_S3', weight:  getDistanceBetweenPoints('nodo_entrada_sala_trabajo2','A301_S3', nodosPlanta3) },
{ from: 'nodo_entrada_sala_trabajo2', to: 'nodo_entrada_biblioteca', weight:  getDistanceBetweenPoints('nodo_entrada_sala_trabajo2','nodo_entrada_biblioteca', nodosPlanta3) },

{ from: 'nodo_entrada_biblioteca', to: 'A301_S4', weight:  getDistanceBetweenPoints('nodo_entrada_biblioteca','A301_S4', nodosPlanta3) },

]

todasLasPlantas.planta3 = {}
todasLasPlantas.planta3.nodes = nodosPlanta3
todasLasPlantas.planta3.edges = edgesPlanta3



const nodosPlanta4=[
//laboratorios
{ id: 'A404_L', latlng: [250.601713, 706.594727],  name: 'Lab de energía solar fotovoltaica' },
{ id: 'A402_L', latlng: [123.141036, 682.261719],  name: 'Lab de energía solar térmica' },
{ id: 'A401_L', latlng: [117.640424, 679.324219],  name: 'Lab de proyectos 2' },

//despachos

// //Aulas
{ id: 'A403_A', latlng: [129.64176, 678.324219],  name: 'Aula de energía solar térmica' },

// //Otros

// //Nodos
{ id: 'nodo_piso4', latlng: [124.614572, 672.8125],  name: 'nodo piso 4 ' },

// //ascensores y/o escaleras

{ id: 'nodo_escalera_principal_piso4', latlng: [258.707521, 724.629883],  name: 'nodo escalera principal piso 4' },
{ id: 'nodo_escalera_entrada_piso4', latlng: [111.857581, 660.811523],  name: 'nodo escalera entrada piso 4' },
    
]



const edgesPlanta4 = [
{ from: 'nodo_escalera_principal_piso4', to: 'A404_L', weight: getDistanceBetweenPoints('nodo_escalera_principal_piso4','A404_L', nodosPlanta4) },

{ from: 'nodo_escalera_entrada_piso4', to: 'nodo_piso4', weight:  getDistanceBetweenPoints('nodo_escalera_entrada_piso4','nodo_piso4', nodosPlanta4)  },

{ from: 'nodo_piso4', to: 'A403_A', weight:  getDistanceBetweenPoints('nodo_piso4','A403_A', nodosPlanta4) },
{ from: 'nodo_piso4', to: 'A402_L', weight:  getDistanceBetweenPoints('nodo_piso4','A402_L', nodosPlanta4)},
{ from: 'nodo_piso4', to: 'A401_L', weight:  getDistanceBetweenPoints('nodo_piso4','A401_L', nodosPlanta4) },

]


todasLasPlantas.planta4 = {}
todasLasPlantas.planta4.nodes = nodosPlanta4
todasLasPlantas.planta4.edges = edgesPlanta4


const ascensores = [
//escalera terraza
{ from: 'nodo_escaleras_terraza_SUBIDA_pisoBAJO', to: 'nodo_escaleras_terraza_BAJADA_piso0', weight:  10}, 
{ from: 'nodo_escaleras_terraza_SUBIDA_piso0', to: 'nodo_escaleras_terraza_BAJADA_piso1', weight:  10}, 
{ from: 'nodo_escaleras_terraza_SUBIDA_piso1', to: 'nodo_escaleras_terraza_piso2', weight:  10}, 

//escalera principal
{ from: 'nodo_escalera_principal_pisoBAJO', to: 'nodo_escalera_principal_BAJADA_piso0', weight: 10},
{ from: 'nodo_escalera_principal_SUBIDA_piso0', to: 'nodo_escalera_principal_BAJADA_piso1', weight: 10},
{ from: 'nodo_escalera_principal_SUBIDA_piso1', to: 'nodo_escalera_principal_BAJADA_piso2', weight: 10},
{ from: 'nodo_escalera_principal_SUBIDA_piso2', to: 'nodo_escalera_principal_BAJADA_piso3', weight: 10},
{ from: 'nodo_escalera_principal_SUBIDA_piso3', to: 'nodo_escalera_principal_piso4', weight: 10},

//escalera bloque A
{ from: 'nodo_escalera_bloque_A_SUBIDA_pisoBAJO', to: 'nodo_escalera_bloque_A_BAJADA_piso0', weight: 10},
{ from: 'nodo_escalera_bloque_A_SUBIDA_piso0', to: 'nodo_escalera_bloque_A_BAJADA_piso1', weight: 10},
{ from: 'nodo_escalera_bloque_A_SUBIDA_piso1', to: 'nodo_escalera_bloque_A_BAJADA_piso2', weight: 10},
{ from: 'nodo_escalera_bloque_A_SUBIDA_piso2', to: 'nodo_escalera_bloque_A_piso3', weight: 10},

//escalera bloque B
{ from: 'nodo_escalera_bloque_B_SUBIDA_pisoBAJO', to: 'nodo_escalera_bloque_B_BAJADA_piso0', weight:  10},
{ from: 'nodo_escalera_bloque_B_SUBIDA_piso0', to: 'nodo_escalera_bloque_B_BAJADA_piso1', weight:  10}, 
{ from: 'nodo_escalera_bloque_B_SUBIDA_piso1', to: 'nodo_escalera_bloque_B_BAJADA_piso2', weight:  10}, 
{ from: 'nodo_escalera_bloque_B_SUBIDA_piso2', to: 'nodo_escalera_bloque_B_piso3', weight:  10}, 

//escalera bloque B secundaria
{ from: 'nodo_escalera_bloque_B_secundaria_SUBIDA_piso0', to: 'nodo_escalera_bloque_B_secundaria_BAJADA_piso1', weight: 10},
{ from: 'nodo_escalera_bloque_B_secundaria_SUBIDA_piso1', to: 'nodo_escalera_bloque_B_secundaria_BAJADA_piso2', weight: 10},
{ from: 'nodo_escalera_bloque_B_secundaria_SUBIDA_piso2', to: 'nodo_escalera_bloque_B_secundaria_piso3', weight: 10},


//escalera bloque C
{ from: 'nodo_escalera_bloque_C', to: 'nodo_escalera_bloque_C_BAJADA_piso1', weight: 10},
{ from: 'nodo_escalera_bloque_C_SUBIDA_piso1', to: 'nodo_escalera_bloque_C_piso2', weight: 10},

//escalera Cafeteria
{ from: 'nodo_escalera_cafeteria_SUBIDA_pisoBAJO', to: 'nodo_escalera_cafeteria_BAJADA_piso0', weight:  10}, 
{ from: 'nodo_escalera_cafeteria_SUBIDA_piso0', to: 'nodo_escalera_cafeteria_BAJADA_piso1', weight:  10},
{ from: 'nodo_escalera_cafeteria_SUBIDA_piso1', to: 'nodo_escalera_cafeteria_piso2', weight:  10}, 

//escalera Entrada

{ from: 'nodo_escalera_entrada_SUBIDA_pisoBAJO', to: 'nodo_escalera_entrada_BAJADA_piso0', weight:  10},
{ from: 'nodo_escalera_entrada_SUBIDA_piso0', to: 'nodo_escalera_entrada_BAJADA_piso1', weight:  10}, 
{ from: 'nodo_escalera_entrada_SUBIDA_piso1', to: 'nodo_escalera_entrada_BAJADA_piso2', weight:  10}, 
{ from: 'nodo_escalera_entrada_SUBIDA_piso2', to: 'nodo_escalera_entrada_BAJADA_piso3', weight:  10},
{ from: 'nodo_escalera_entrada_SUBIDA_piso3', to: 'nodo_escalera_entrada_piso4', weight:  10}, 

//escalera Pista Deportiva
{ from: 'nodo_escalera_pista_deportiva_pisoBAJO', to: 'nodo_escalera_pista_deportiva_BAJADA_piso0', weight:  10}, 
]


module.exports = {todasLasPlantas, ascensores}