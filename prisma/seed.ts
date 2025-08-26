/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Datos estáticos
const carreras = [
  {
    id: '3cc60551-e259-4b60-8047-5d3b1a324e53',
    codigo: 187,
    nombre: 'INGENIERIA INFORMATICA',
    estaActivo: true,
  },
];

const planesDeEstudio = [
  {
    id: '32d85f90-61f9-449d-ba73-7b186810fc93',
    version: 3,
    carreraId: '3cc60551-e259-4b60-8047-5d3b1a324e53',
    estaActivo: true,
  },
];

const niveles = [
  {
    id: 'af527c69-db52-4e3e-82d7-200d1d5760f6',
    semestre: 1,
    estaActivo: true,
  },
  { id: '8ec6bf45-72b4-4306-b6fa-8ddeb4d588c5', semestre: 2, estaActivo: true },
  { id: 'f333303b-1801-4930-b4a9-080de1a131f8', semestre: 3, estaActivo: true },
  { id: 'a27ef1ea-fded-4495-b50c-453f256e5322', semestre: 4, estaActivo: true },
  { id: '637f890f-b5e6-48da-8511-584707879ea1', semestre: 5, estaActivo: true },
  { id: '5116c73b-93f5-45cc-98b5-0d4c7f81b958', semestre: 6, estaActivo: true },
  { id: '9c7bc65d-7870-4961-a192-5d7b3a571861', semestre: 7, estaActivo: true },
  { id: '68f3cfff-a137-440b-84e6-00ad3bdbbc4e', semestre: 8, estaActivo: true },
  { id: 'dce5cf69-ff9f-4588-9751-94bc3feee673', semestre: 9, estaActivo: true },
  {
    id: '274fe6e9-e299-4758-ad39-e92037f39bc3',
    semestre: 10,
    estaActivo: true,
  },
];

const materias = [
  {
    id: '2cde4bc0-093e-4c8b-89aa-29e6915cf96b',
    sigla: 'MAT-101',
    nombre: 'Calculo I',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: 'af527c69-db52-4e3e-82d7-200d1d5760f6',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '6b46118c-53be-4b3b-925f-b7a010f54b1b',
    sigla: 'INF119',
    nombre: 'Estructuras Discretas',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: 'af527c69-db52-4e3e-82d7-200d1d5760f6',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '96e2722c-2bbe-4214-bb1e-fd8c2c2ad7cf',
    sigla: 'INF110',
    nombre: 'Introduccion a la informatica',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: 'af527c69-db52-4e3e-82d7-200d1d5760f6',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '5d6b10ff-e71e-455c-99b6-31c7f0f60a3d',
    sigla: 'FIS110',
    nombre: 'Fisica I',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: 'af527c69-db52-4e3e-82d7-200d1d5760f6',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '97170af9-a29f-4750-979f-c4f4a3fa20aa',
    sigla: 'LIN100',
    nombre: 'Ingles Tecnico I',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: 'af527c69-db52-4e3e-82d7-200d1d5760f6',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'bf96d2aa-7a36-4a76-b15b-43b499439f53',
    sigla: 'MAT102',
    nombre: 'Calculo II',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '8ec6bf45-72b4-4306-b6fa-8ddeb4d588c5',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '2c1a27c9-3e9c-4042-a034-293948bc0765',
    sigla: 'MAT103',
    nombre: 'Algebra Lineal',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '8ec6bf45-72b4-4306-b6fa-8ddeb4d588c5',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '4a95dd4c-4074-4e85-b7e9-b73b5275bb49',
    sigla: 'INF120',
    nombre: 'Programacion I',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '8ec6bf45-72b4-4306-b6fa-8ddeb4d588c5',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'bd04afa2-e8c8-4fd1-a9ee-321631b5f7f5',
    sigla: 'FIS102',
    nombre: 'Fisica II',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '8ec6bf45-72b4-4306-b6fa-8ddeb4d588c5',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'cc1cfcab-b6c2-4eb4-9f65-e336e814bc66',
    sigla: 'LIN101',
    nombre: 'Ingles Tecnico II',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '8ec6bf45-72b4-4306-b6fa-8ddeb4d588c5',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '989f82b0-1b2a-498c-95ed-3d95c61ba0c8',
    sigla: 'MAT207',
    nombre: 'Ecuaciones Diferenciales',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: 'f333303b-1801-4930-b4a9-080de1a131f8',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '1864140e-7618-420a-a40c-cfbae6570d03',
    sigla: 'INF210',
    nombre: 'Programacion II',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: 'f333303b-1801-4930-b4a9-080de1a131f8',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'e13cc30d-249c-4b57-9b73-5b9c260a1cd1',
    sigla: 'INF211',
    nombre: 'Arquitectura de Computadoras',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: 'f333303b-1801-4930-b4a9-080de1a131f8',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'e6467fb3-cdc7-4e26-a8f2-720c4d65b87c',
    sigla: 'FIS200',
    nombre: 'Fisica III',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: 'f333303b-1801-4930-b4a9-080de1a131f8',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'bdf81de3-0cf1-43fc-899d-71bebd8d8325',
    sigla: 'ADM100',
    nombre: 'Administracion',
    creditos: 4,
    esElectiva: false,
    estaActiva: true,
    nivelId: 'f333303b-1801-4930-b4a9-080de1a131f8',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'b0256b0d-704b-432e-a37d-60ed5e1077f8',
    sigla: 'MAT202',
    nombre: 'Probabilidades y Estadisticas I',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: 'a27ef1ea-fded-4495-b50c-453f256e5322',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '04cfd4a6-0050-473d-be0a-7374044ebda2',
    sigla: 'MAT205',
    nombre: 'Metodos Numericos',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: 'a27ef1ea-fded-4495-b50c-453f256e5322',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '5ebb0457-b52e-4681-b4fd-458ada52e0b6',
    sigla: 'INF220',
    nombre: 'Estructura de Datos I',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: 'a27ef1ea-fded-4495-b50c-453f256e5322',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'fe46266e-7138-41dd-8efd-5d602331ad73',
    sigla: 'INF221',
    nombre: 'Programacion Ensamblador',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: 'a27ef1ea-fded-4495-b50c-453f256e5322',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'c26b41f0-9df0-480f-bd1b-e286a14ffbcd',
    sigla: 'ADM200',
    nombre: 'Contabilidad',
    creditos: 4,
    esElectiva: false,
    estaActiva: true,
    nivelId: 'a27ef1ea-fded-4495-b50c-453f256e5322',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'ac746e01-a05c-402a-8e7f-44807ad62de8',
    sigla: 'MAT302',
    nombre: 'Probabilidades y Estadisticas II',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '637f890f-b5e6-48da-8511-584707879ea1',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '65cc4843-1a24-4905-8dfc-6f6cd0949951',
    sigla: 'INF318',
    nombre: 'Programacion Logica y Funcional',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '637f890f-b5e6-48da-8511-584707879ea1',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '6278d8ee-143f-40c6-bfd6-77667fb39ee8',
    sigla: 'INF310',
    nombre: 'Estructura de Datos II',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '637f890f-b5e6-48da-8511-584707879ea1',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '372ec911-23cf-4394-80b5-61f1046626a1',
    sigla: 'INF312',
    nombre: 'Base de Datos I',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '637f890f-b5e6-48da-8511-584707879ea1',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'b011661e-2d17-4669-8174-e81ae6780889',
    sigla: 'INF319',
    nombre: 'Lenguajes Formales',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '637f890f-b5e6-48da-8511-584707879ea1',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'a851a087-fead-488b-b78b-87f035adc954',
    sigla: 'MAT329',
    nombre: 'Investigacion Operativa I',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '5116c73b-93f5-45cc-98b5-0d4c7f81b958',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'fc449a17-e78e-4313-958b-eeeafaaed4ed',
    sigla: 'INF342',
    nombre: 'Sistemas de Informacion I',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '5116c73b-93f5-45cc-98b5-0d4c7f81b958',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '785a58e2-d6b1-475f-ac51-607790622a40',
    sigla: 'INF323',
    nombre: 'Sistemas Operativos I',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '5116c73b-93f5-45cc-98b5-0d4c7f81b958',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'e9c4b64d-6143-4a46-a099-110f20733890',
    sigla: 'INF322',
    nombre: 'Base de Datos II',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '5116c73b-93f5-45cc-98b5-0d4c7f81b958',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'b14a91ea-c91c-42cd-ba8a-3dbf56ecb84a',
    sigla: 'INF329',
    nombre: 'Compiladores',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '5116c73b-93f5-45cc-98b5-0d4c7f81b958',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'f8edc2c6-a152-47c1-b688-9cc38bc9de19',
    sigla: 'MAT419',
    nombre: 'Investigacion Operativa II',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '9c7bc65d-7870-4961-a192-5d7b3a571861',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '5c16eaf5-8032-4c26-a04a-275239294aad',
    sigla: 'INF418',
    nombre: 'Inteligencia Artificial',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '9c7bc65d-7870-4961-a192-5d7b3a571861',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '956c275c-3dc7-4b48-9aeb-f9f95cce13ab',
    sigla: 'INF413',
    nombre: 'Sistemas Operativos II',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '9c7bc65d-7870-4961-a192-5d7b3a571861',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '2425af82-30e6-46db-8aa7-3b403201da63',
    sigla: 'INF433',
    nombre: 'Redes I',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '9c7bc65d-7870-4961-a192-5d7b3a571861',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '728022be-790d-42c0-93c6-2139d681c555',
    sigla: 'INF412',
    nombre: 'Sistemas de Informacion II',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '9c7bc65d-7870-4961-a192-5d7b3a571861',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '48361832-0bb0-4bd1-ac42-eb3fbbe25d8b',
    sigla: 'INF428',
    nombre: 'Sistemas Expertos',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '68f3cfff-a137-440b-84e6-00ad3bdbbc4e',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '7ff17e90-07aa-4ceb-abd4-19804723a531',
    sigla: 'INF442',
    nombre: 'Sistemas de Informacion Geografica',
    creditos: 4,
    esElectiva: false,
    estaActiva: true,
    nivelId: '68f3cfff-a137-440b-84e6-00ad3bdbbc4e',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '9d2e0a42-9237-42a4-bff3-0ad6987f75a8',
    sigla: 'INF423',
    nombre: 'Redes II',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '68f3cfff-a137-440b-84e6-00ad3bdbbc4e',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '53a63d12-05b7-4be7-8e28-6f300db3d2d6',
    sigla: 'INF422',
    nombre: 'Ingenieria de Software I',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '68f3cfff-a137-440b-84e6-00ad3bdbbc4e',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'cb30a8fa-ee4e-4c1a-a00d-ff6dd04a677c',
    sigla: 'INF511',
    nombre: 'Taller de Grado I',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: 'dce5cf69-ff9f-4588-9751-94bc3feee673',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '72024d66-3707-4376-98ed-0b9b97f520a1',
    sigla: 'INF512',
    nombre: 'Ingenieria de Software II',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: 'dce5cf69-ff9f-4588-9751-94bc3feee673',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'c16f1f87-686f-4d1a-924b-a76e3b529de8',
    sigla: 'INF513',
    nombre: 'Tecnologia Web',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: 'dce5cf69-ff9f-4588-9751-94bc3feee673',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'f86db3c4-0685-4a25-a0b4-fc97778515a1',
    sigla: 'INF552',
    nombre: 'Arquitectura de Software',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: 'dce5cf69-ff9f-4588-9751-94bc3feee673',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'ea8f37c6-cd0f-475c-9664-cc2eb30431a8',
    sigla: 'GRL001',
    nombre: 'Modalidad Licenciatura',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '274fe6e9-e299-4758-ad39-e92037f39bc3',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '1f552415-fe58-40ee-89e8-c145dab40c31',
    sigla: 'ECO449',
    nombre: 'Preparacion y Evaluacion de Proyectos',
    creditos: 5,
    esElectiva: false,
    estaActiva: true,
    nivelId: '68f3cfff-a137-440b-84e6-00ad3bdbbc4e',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
];

const prerequisitos = [
  {
    id: '6452fb5a-4ec0-42d0-a94d-b3722c15800e',
    siglaMateria: 'bf96d2aa-7a36-4a76-b15b-43b499439f53',
    siglaPrerequisito: '2cde4bc0-093e-4c8b-89aa-29e6915cf96b',
  },
  {
    id: 'f39d88a2-563b-4dd2-9b7c-2cd44636bc1b',
    siglaMateria: '2c1a27c9-3e9c-4042-a034-293948bc0765',
    siglaPrerequisito: '6b46118c-53be-4b3b-925f-b7a010f54b1b',
  },
  {
    id: '2ed7059c-348d-46cb-a46d-3d59165a6c47',
    siglaMateria: '4a95dd4c-4074-4e85-b7e9-b73b5275bb49',
    siglaPrerequisito: '96e2722c-2bbe-4214-bb1e-fd8c2c2ad7cf',
  },
  {
    id: '58323ae2-f36e-4714-ba1d-af0ad54d1980',
    siglaMateria: 'bd04afa2-e8c8-4fd1-a9ee-321631b5f7f5',
    siglaPrerequisito: '5d6b10ff-e71e-455c-99b6-31c7f0f60a3d',
  },
  {
    id: '475492b3-9fcd-48c8-8e82-0f1c20ff293e',
    siglaMateria: 'cc1cfcab-b6c2-4eb4-9f65-e336e814bc66',
    siglaPrerequisito: '97170af9-a29f-4750-979f-c4f4a3fa20aa',
  },
  {
    id: 'eb99e220-419b-4e37-820f-52b7596f214c',
    siglaMateria: '989f82b0-1b2a-498c-95ed-3d95c61ba0c8',
    siglaPrerequisito: 'bf96d2aa-7a36-4a76-b15b-43b499439f53',
  },
  {
    id: 'f5a2dfe1-a9ec-48d9-8ce8-32cff96b6c86',
    siglaMateria: 'b0256b0d-704b-432e-a37d-60ed5e1077f8',
    siglaPrerequisito: 'bf96d2aa-7a36-4a76-b15b-43b499439f53',
  },
  {
    id: '724955ae-d31a-4f62-8af8-2b975be4c905',
    siglaMateria: '1864140e-7618-420a-a40c-cfbae6570d03',
    siglaPrerequisito: '2c1a27c9-3e9c-4042-a034-293948bc0765',
  },
  {
    id: '870b0eed-0ee1-4d0a-a707-9d18f951b325',
    siglaMateria: '1864140e-7618-420a-a40c-cfbae6570d03',
    siglaPrerequisito: '4a95dd4c-4074-4e85-b7e9-b73b5275bb49',
  },
  {
    id: '378a2031-d021-4de1-b18e-4fbb122caba8',
    siglaMateria: 'e13cc30d-249c-4b57-9b73-5b9c260a1cd1',
    siglaPrerequisito: '4a95dd4c-4074-4e85-b7e9-b73b5275bb49',
  },
  {
    id: '175dbf37-5071-493f-8024-34ff6a31cade',
    siglaMateria: 'e13cc30d-249c-4b57-9b73-5b9c260a1cd1',
    siglaPrerequisito: 'bd04afa2-e8c8-4fd1-a9ee-321631b5f7f5',
  },
  {
    id: '87b2eeb5-7ef9-4883-a586-a41622b9f421',
    siglaMateria: 'e6467fb3-cdc7-4e26-a8f2-720c4d65b87c',
    siglaPrerequisito: 'bd04afa2-e8c8-4fd1-a9ee-321631b5f7f5',
  },
  {
    id: '7d34e757-f796-4612-a063-87406740da54',
    siglaMateria: 'c26b41f0-9df0-480f-bd1b-e286a14ffbcd',
    siglaPrerequisito: 'bdf81de3-0cf1-43fc-899d-71bebd8d8325',
  },
  {
    id: 'af3219f6-0411-4671-9e33-4487d8c0e643',
    siglaMateria: '04cfd4a6-0050-473d-be0a-7374044ebda2',
    siglaPrerequisito: '989f82b0-1b2a-498c-95ed-3d95c61ba0c8',
  },
  {
    id: '4d6188df-9089-4f1c-b32d-edc02ecf60b4',
    siglaMateria: '5ebb0457-b52e-4681-b4fd-458ada52e0b6',
    siglaPrerequisito: '1864140e-7618-420a-a40c-cfbae6570d03',
  },
  {
    id: 'c0892b3d-f492-4b9c-a524-43ccdf949fb4',
    siglaMateria: 'fe46266e-7138-41dd-8efd-5d602331ad73',
    siglaPrerequisito: 'e13cc30d-249c-4b57-9b73-5b9c260a1cd1',
  },
  {
    id: '5c2d0d77-6553-44ea-be0d-c3c7067bb58c',
    siglaMateria: 'ac746e01-a05c-402a-8e7f-44807ad62de8',
    siglaPrerequisito: 'b0256b0d-704b-432e-a37d-60ed5e1077f8',
  },
  {
    id: '015c9822-04b4-4a0d-ac9e-aa673f6e261c',
    siglaMateria: '65cc4843-1a24-4905-8dfc-6f6cd0949951',
    siglaPrerequisito: '5ebb0457-b52e-4681-b4fd-458ada52e0b6',
  },
  {
    id: '7d03f1bc-06c4-4ea7-822f-3a4f7e7fda48',
    siglaMateria: '6278d8ee-143f-40c6-bfd6-77667fb39ee8',
    siglaPrerequisito: '5ebb0457-b52e-4681-b4fd-458ada52e0b6',
  },
  {
    id: 'c57be253-35d4-47d7-9e1d-97340b0e502d',
    siglaMateria: '372ec911-23cf-4394-80b5-61f1046626a1',
    siglaPrerequisito: '5ebb0457-b52e-4681-b4fd-458ada52e0b6',
  },
  {
    id: '779bd7d4-4776-41c1-91db-dc57493e62fa',
    siglaMateria: 'b011661e-2d17-4669-8174-e81ae6780889',
    siglaPrerequisito: '5ebb0457-b52e-4681-b4fd-458ada52e0b6',
  },
  {
    id: '3f367dc8-d3f1-4738-835b-3c4f7c5d8e7d',
    siglaMateria: 'a851a087-fead-488b-b78b-87f035adc954',
    siglaPrerequisito: 'ac746e01-a05c-402a-8e7f-44807ad62de8',
  },
  {
    id: 'af142819-a800-4e84-9056-bb93874fe50e',
    siglaMateria: '5c16eaf5-8032-4c26-a04a-275239294aad',
    siglaPrerequisito: '65cc4843-1a24-4905-8dfc-6f6cd0949951',
  },
  {
    id: 'e2bd4ab0-eda0-41de-862e-92d00267712a',
    siglaMateria: '5c16eaf5-8032-4c26-a04a-275239294aad',
    siglaPrerequisito: '6278d8ee-143f-40c6-bfd6-77667fb39ee8',
  },
  {
    id: '9bf26677-411f-4e4f-8832-4180362e7b50',
    siglaMateria: '785a58e2-d6b1-475f-ac51-607790622a40',
    siglaPrerequisito: '6278d8ee-143f-40c6-bfd6-77667fb39ee8',
  },
  {
    id: '7ce3d9fe-fb21-435f-82d5-1c70977a2957',
    siglaMateria: 'b14a91ea-c91c-42cd-ba8a-3dbf56ecb84a',
    siglaPrerequisito: '6278d8ee-143f-40c6-bfd6-77667fb39ee8',
  },
  {
    id: 'a150c32b-6392-42b6-b7f8-c4cae4ac9f45',
    siglaMateria: 'b14a91ea-c91c-42cd-ba8a-3dbf56ecb84a',
    siglaPrerequisito: 'b011661e-2d17-4669-8174-e81ae6780889',
  },
  {
    id: 'e1a6a45e-940c-4f40-99a5-afe30a834881',
    siglaMateria: 'e9c4b64d-6143-4a46-a099-110f20733890',
    siglaPrerequisito: '372ec911-23cf-4394-80b5-61f1046626a1',
  },
  {
    id: 'dbd6ac4c-05b9-4b0d-ba93-ed544364fdec',
    siglaMateria: '728022be-790d-42c0-93c6-2139d681c555',
    siglaPrerequisito: '372ec911-23cf-4394-80b5-61f1046626a1',
  },
  {
    id: 'ddd9cc4a-7c08-4569-9e84-416cc78236db',
    siglaMateria: 'f8edc2c6-a152-47c1-b688-9cc38bc9de19',
    siglaPrerequisito: 'a851a087-fead-488b-b78b-87f035adc954',
  },
  {
    id: '0658bbfe-5621-4420-89ae-1cfcf43182a4',
    siglaMateria: '728022be-790d-42c0-93c6-2139d681c555',
    siglaPrerequisito: 'fc449a17-e78e-4313-958b-eeeafaaed4ed',
  },
  {
    id: 'eb886c5a-8274-4c0f-bdf8-aa8026163809',
    siglaMateria: '956c275c-3dc7-4b48-9aeb-f9f95cce13ab',
    siglaPrerequisito: '785a58e2-d6b1-475f-ac51-607790622a40',
  },
  {
    id: '7e35e334-8448-43e5-9a26-f91080466ac8',
    siglaMateria: '2425af82-30e6-46db-8aa7-3b403201da63',
    siglaPrerequisito: '785a58e2-d6b1-475f-ac51-607790622a40',
  },
  {
    id: '6d033509-b7da-4501-91e6-fbae9e3410e1',
    siglaMateria: '728022be-790d-42c0-93c6-2139d681c555',
    siglaPrerequisito: 'e9c4b64d-6143-4a46-a099-110f20733890',
  },
  {
    id: '2c26ee7f-8812-4525-9e15-cbfbef263b8f',
    siglaMateria: '1f552415-fe58-40ee-89e8-c145dab40c31',
    siglaPrerequisito: 'f8edc2c6-a152-47c1-b688-9cc38bc9de19',
  },
  {
    id: '7d1550c9-5a7e-4c3e-8bf4-6d1dd89b352f',
    siglaMateria: '48361832-0bb0-4bd1-ac42-eb3fbbe25d8b',
    siglaPrerequisito: '5c16eaf5-8032-4c26-a04a-275239294aad',
  },
  {
    id: '64c18e84-76ed-490a-ba2c-2cf7ea77b517',
    siglaMateria: '48361832-0bb0-4bd1-ac42-eb3fbbe25d8b',
    siglaPrerequisito: '728022be-790d-42c0-93c6-2139d681c555',
  },
  {
    id: '759e22d7-c34f-43bb-bb8c-5943cf32fcd4',
    siglaMateria: '7ff17e90-07aa-4ceb-abd4-19804723a531',
    siglaPrerequisito: '728022be-790d-42c0-93c6-2139d681c555',
  },
  {
    id: '5d97a4cc-1286-4493-a42f-001684968965',
    siglaMateria: '53a63d12-05b7-4be7-8e28-6f300db3d2d6',
    siglaPrerequisito: '728022be-790d-42c0-93c6-2139d681c555',
  },
  {
    id: '82bff5b9-1b5e-421d-8b4d-97eaeea6ab0c',
    siglaMateria: '9d2e0a42-9237-42a4-bff3-0ad6987f75a8',
    siglaPrerequisito: '2425af82-30e6-46db-8aa7-3b403201da63',
  },
  {
    id: 'edb6716d-fd45-46c3-99bb-53c5de4221f4',
    siglaMateria: 'ea8f37c6-cd0f-475c-9664-cc2eb30431a8',
    siglaPrerequisito: 'cb30a8fa-ee4e-4c1a-a00d-ff6dd04a677c',
  },
  {
    id: '56fa5938-37e7-4ef1-bce5-e10b761ebf17',
    siglaMateria: 'ea8f37c6-cd0f-475c-9664-cc2eb30431a8',
    siglaPrerequisito: '72024d66-3707-4376-98ed-0b9b97f520a1',
  },
  {
    id: 'f52c2edf-e4da-4a12-9d55-7f8fda852fd3',
    siglaMateria: 'ea8f37c6-cd0f-475c-9664-cc2eb30431a8',
    siglaPrerequisito: 'c16f1f87-686f-4d1a-924b-a76e3b529de8',
  },
  {
    id: '38b0518d-0fc9-48be-b32f-740c32f119d1',
    siglaMateria: 'ea8f37c6-cd0f-475c-9664-cc2eb30431a8',
    siglaPrerequisito: 'f86db3c4-0685-4a25-a0b4-fc97778515a1',
  },
];

const docentesBase = [
  {
    nombre: 'Carlos',
    apellido_paterno: 'Gomez',
    apellido_materno: 'Lopez',
    ci: 'CI100001',
    registro: 'REG-2001',
    email: 'carlos.gomez@example.com',
    telefono: '700000001',
  },
  {
    nombre: 'Maria',
    apellido_paterno: 'Fernandez',
    apellido_materno: 'Rojas',
    ci: 'CI100002',
    registro: 'REG-2002',
    email: 'maria.fernandez@example.com',
    telefono: '700000002',
  },
  {
    nombre: 'Javier',
    apellido_paterno: 'Torrez',
    apellido_materno: 'Aguilar',
    ci: 'CI100003',
    registro: 'REG-2003',
    email: 'javier.torrez@example.com',
    telefono: '700000003',
  },
  {
    nombre: 'Lucia',
    apellido_paterno: 'Mendoza',
    apellido_materno: 'Salazar',
    ci: 'CI100004',
    registro: 'REG-2004',
    email: 'lucia.mendoza@example.com',
    telefono: '700000004',
  },
  {
    nombre: 'Fernando',
    apellido_paterno: 'Vargas',
    apellido_materno: 'Paredes',
    ci: 'CI100005',
    registro: 'REG-2005',
    email: 'fernando.vargas@example.com',
    telefono: '700000005',
  },
  {
    nombre: 'Andrea',
    apellido_paterno: 'Cruz',
    apellido_materno: 'Quispe',
    ci: 'CI100006',
    registro: 'REG-2006',
    email: 'andrea.cruz@example.com',
    telefono: '700000006',
  },
  {
    nombre: 'Luis',
    apellido_paterno: 'Santos',
    apellido_materno: 'Ibarra',
    ci: 'CI100007',
    registro: 'REG-2007',
    email: 'luis.santos@example.com',
    telefono: '700000007',
  },
  {
    nombre: 'Patricia',
    apellido_paterno: 'Ramos',
    apellido_materno: 'Arce',
    ci: 'CI100008',
    registro: 'REG-2008',
    email: 'patricia.ramos@example.com',
    telefono: '700000008',
  },
  {
    nombre: 'Hector',
    apellido_paterno: 'Silva',
    apellido_materno: 'Montoya',
    ci: 'CI100009',
    registro: 'REG-2009',
    email: 'hector.silva@example.com',
    telefono: '700000009',
  },
  {
    nombre: 'Elena',
    apellido_paterno: 'Flores',
    apellido_materno: 'Castro',
    ci: 'CI100010',
    registro: 'REG-2010',
    email: 'elena.flores@example.com',
    telefono: '700000010',
  },
  {
    nombre: 'Oscar',
    apellido_paterno: 'Rivera',
    apellido_materno: 'Camacho',
    ci: 'CI100011',
    registro: 'REG-2011',
    email: 'oscar.rivera@example.com',
    telefono: '700000011',
  },
  {
    nombre: 'Veronica',
    apellido_paterno: 'Peña',
    apellido_materno: 'Suarez',
    ci: 'CI100012',
    registro: 'REG-2012',
    email: 'veronica.pena@example.com',
    telefono: '700000012',
  },
  {
    nombre: 'Ricardo',
    apellido_paterno: 'Loayza',
    apellido_materno: 'Mercado',
    ci: 'CI100013',
    registro: 'REG-2013',
    email: 'ricardo.loayza@example.com',
    telefono: '700000013',
  },
  {
    nombre: 'Natalia',
    apellido_paterno: 'Herrera',
    apellido_materno: 'Bustamante',
    ci: 'CI100014',
    registro: 'REG-2014',
    email: 'natalia.herrera@example.com',
    telefono: '700000014',
  },
  {
    nombre: 'Miguel',
    apellido_paterno: 'Arce',
    apellido_materno: 'Lima',
    ci: 'CI100015',
    registro: 'REG-2015',
    email: 'miguel.arce@example.com',
    telefono: '700000015',
  },
  {
    nombre: 'Silvia',
    apellido_paterno: 'Cordero',
    apellido_materno: 'Tapia',
    ci: 'CI100016',
    registro: 'REG-2016',
    email: 'silvia.cordero@example.com',
    telefono: '700000016',
  },
  {
    nombre: 'Jorge',
    apellido_paterno: 'Molina',
    apellido_materno: 'Reyes',
    ci: 'CI100017',
    registro: 'REG-2017',
    email: 'jorge.molina@example.com',
    telefono: '700000017',
  },
  {
    nombre: 'Gabriela',
    apellido_paterno: 'Ibáñez',
    apellido_materno: 'Prado',
    ci: 'CI100018',
    registro: 'REG-2018',
    email: 'gabriela.ibanez@example.com',
    telefono: '700000018',
  },
  {
    nombre: 'Pablo',
    apellido_paterno: 'Rojas',
    apellido_materno: 'Chavez',
    ci: 'CI100019',
    registro: 'REG-2019',
    email: 'pablo.rojas@example.com',
    telefono: '700000019',
  },
  {
    nombre: 'Carolina',
    apellido_paterno: 'Salinas',
    apellido_materno: 'Gutierrez',
    ci: 'CI100020',
    registro: 'REG-2020',
    email: 'carolina.salinas@example.com',
    telefono: '700000020',
  },
  {
    nombre: 'Diego',
    apellido_paterno: 'Quiroga',
    apellido_materno: 'Leon',
    ci: 'CI100021',
    registro: 'REG-2021',
    email: 'diego.quiroga@example.com',
    telefono: '700000021',
  },
  {
    nombre: 'Monica',
    apellido_paterno: 'Villalba',
    apellido_materno: 'Zapata',
    ci: 'CI100022',
    registro: 'REG-2022',
    email: 'monica.villalba@example.com',
    telefono: '700000022',
  },
  {
    nombre: 'Alberto',
    apellido_paterno: 'Serrano',
    apellido_materno: 'Rico',
    ci: 'CI100023',
    registro: 'REG-2023',
    email: 'alberto.serrano@example.com',
    telefono: '700000023',
  },
  {
    nombre: 'Rocio',
    apellido_paterno: 'Medina',
    apellido_materno: 'Ortega',
    ci: 'CI100024',
    registro: 'REG-2024',
    email: 'rocio.medina@example.com',
    telefono: '700000024',
  },
  {
    nombre: 'Sergio',
    apellido_paterno: 'Fuentes',
    apellido_materno: 'Campos',
    ci: 'CI100025',
    registro: 'REG-2025',
    email: 'sergio.fuentes@example.com',
    telefono: '700000025',
  },
];

// ---- Datasets adicionales para el resto de modelos ----
const modulos = [{ id: '4e9e7f2d-6d8a-41d3-9d2a-b5a1b6b60236', numero: 236 }];

const aulaGrupoMaterias = [
  { id: 'c3d5f8a1-1f11-4f2a-9b61-111111111111' },
  { id: 'c3d5f8a1-1f11-4f2a-9b61-222222222222' },
  { id: 'c3d5f8a1-1f11-4f2a-9b61-333333333333' },
  { id: 'c3d5f8a1-1f11-4f2a-9b61-444444444444' },
];

// Generar aulas del 11 al 46 en el módulo 236
const aulas: any[] = [];
for (let numero = 11; numero <= 46; numero++) {
  aulas.push({
    id: `aula-236-${numero.toString().padStart(2, '0')}`,
    numero: numero,
    capacidad: 35,
    aulaGrupoMateriaId: 'c3d5f8a1-1f11-4f2a-9b61-111111111111', // Por defecto
    moduloId: '4e9e7f2d-6d8a-41d3-9d2a-b5a1b6b60236',
  });
}

const gestiones = [{ id: '7a7c4c88-9c2a-4e74-9c1b-aaaaaaaaaaaa', año: '2025' }];

const periodos = [
  {
    id: '9b0f2d71-4c4e-4a3b-bbbb-bbbbbbbbbbbb',
    numero: '1',
    fechaInicio: new Date('2025-02-01'),
    fechaFin: new Date('2025-06-30'),
    gestionId: '7a7c4c88-9c2a-4e74-9c1b-aaaaaaaaaaaa',
  },
  {
    id: '9b0f2d71-4c4e-4a3b-bbbb-cccccccccccc',
    numero: '2',
    fechaInicio: new Date('2025-08-01'),
    fechaFin: new Date('2025-12-15'),
    gestionId: '7a7c4c88-9c2a-4e74-9c1b-aaaaaaaaaaaa',
  },
];

const avances = [
  { id: '5d8c9f2e-6f55-4c1d-aaaa-dddddddddddd' },
  { id: '5d8c9f2e-6f55-4c1d-aaaa-eeeeeeeeeeee' },
];

const estudiantesSeed = [
  {
    id: 'e1a11111-2222-3333-4444-000000000001',
    nombre: 'Juan',
    apellido_paterno: 'Perez',
    apellido_materno: 'Lopez',
    telefono: '760000001',
    ci: 'ECI100001',
    email: 'juan.perez@example.com',
    matricula: 'MAT-1001',
  },
  {
    id: 'e1a11111-2222-3333-4444-000000000002',
    nombre: 'Ana',
    apellido_paterno: 'Gonzalez',
    apellido_materno: 'Rios',
    telefono: '760000002',
    ci: 'ECI100002',
    email: 'ana.gonzalez@example.com',
    matricula: 'MAT-1002',
  },
  {
    id: 'e1a11111-2222-3333-4444-000000000003',
    nombre: 'Luis',
    apellido_paterno: 'Martinez',
    apellido_materno: 'Castro',
    telefono: '760000003',
    ci: 'ECI100003',
    email: 'luis.martinez@example.com',
    matricula: 'MAT-1003',
  },
  {
    id: 'e1a11111-2222-3333-4444-000000000004',
    nombre: 'Valeria',
    apellido_paterno: 'Gutierrez',
    apellido_materno: 'Suarez',
    telefono: '760000004',
    ci: 'ECI100004',
    email: 'valeria.gutierrez@example.com',
    matricula: 'MAT-1004',
  },
  {
    id: 'e1a11111-2222-3333-4444-000000000005',
    nombre: 'Marco',
    apellido_paterno: 'Quispe',
    apellido_materno: 'Flores',
    telefono: '760000005',
    ci: 'ECI100005',
    email: 'marco.quispe@example.com',
    matricula: 'MAT-1005',
  },
];

const fichasInscripcion = [
  {
    id: 'f1b22222-3333-4444-5555-000000000001',
    estudianteId: 'e1a11111-2222-3333-4444-000000000001',
  },
  {
    id: 'f1b22222-3333-4444-5555-000000000002',
    estudianteId: 'e1a11111-2222-3333-4444-000000000002',
  },
  {
    id: 'f1b22222-3333-4444-5555-000000000003',
    estudianteId: 'e1a11111-2222-3333-4444-000000000003',
  },
];

const detallesInscripcion = [
  {
    id: 'd1c33333-4444-5555-6666-000000000001',
    fichaInscripcionId: 'f1b22222-3333-4444-5555-000000000001',
  },
  {
    id: 'd1c33333-4444-5555-6666-000000000002',
    fichaInscripcionId: 'f1b22222-3333-4444-5555-000000000002',
  },
  {
    id: 'd1c33333-4444-5555-6666-000000000003',
    fichaInscripcionId: 'f1b22222-3333-4444-5555-000000000003',
  },
  {
    id: 'd1c33333-4444-5555-6666-000000000004',
    fichaInscripcionId: 'f1b22222-3333-4444-5555-000000000001',
  },
  {
    id: 'd1c33333-4444-5555-6666-000000000005',
    fichaInscripcionId: 'f1b22222-3333-4444-5555-000000000002',
  },
  {
    id: 'd1c33333-4444-5555-6666-000000000006',
    fichaInscripcionId: 'f1b22222-3333-4444-5555-000000000003',
  },
];

const sampleMaterias = [
  '2cde4bc0-093e-4c8b-89aa-29e6915cf96b',
  '6b46118c-53be-4b3b-925f-b7a010f54b1b',
  '4a95dd4c-4074-4e85-b7e9-b73b5275bb49',
];

const grupoMaterias = [
  // Grupos para MAT-101 (Cálculo I)
  {
    id: 'g1d44444-5555-6666-7777-000000000001',
    nombre: 'SC',
    materiaId: sampleMaterias[0], // MAT-101
    docenteId: '' as string,
    detalleInscripcionId: 'd1c33333-4444-5555-6666-000000000001',
    aulaGrupoMateriaId: 'c3d5f8a1-1f11-4f2a-9b61-111111111111',
    periodoId: '9b0f2d71-4c4e-4a3b-bbbb-bbbbbbbbbbbb',
  },
  {
    id: 'g1d44444-5555-6666-7777-000000000002',
    nombre: 'SA',
    materiaId: sampleMaterias[0], // MAT-101
    docenteId: '' as string,
    detalleInscripcionId: 'd1c33333-4444-5555-6666-000000000002',
    aulaGrupoMateriaId: 'c3d5f8a1-1f11-4f2a-9b61-222222222222',
    periodoId: '9b0f2d71-4c4e-4a3b-bbbb-bbbbbbbbbbbb',
  },
  {
    id: 'g1d44444-5555-6666-7777-000000000003',
    nombre: 'SX',
    materiaId: sampleMaterias[0], // MAT-101
    docenteId: '' as string,
    detalleInscripcionId: 'd1c33333-4444-5555-6666-000000000003',
    aulaGrupoMateriaId: 'c3d5f8a1-1f11-4f2a-9b61-333333333333',
    periodoId: '9b0f2d71-4c4e-4a3b-bbbb-bbbbbbbbbbbb',
  },
  {
    id: 'g1d44444-5555-6666-7777-000000000004',
    nombre: 'NW',
    materiaId: sampleMaterias[0], // MAT-101
    docenteId: '' as string,
    detalleInscripcionId: 'd1c33333-4444-5555-6666-000000000004',
    aulaGrupoMateriaId: 'c3d5f8a1-1f11-4f2a-9b61-444444444444',
    periodoId: '9b0f2d71-4c4e-4a3b-bbbb-bbbbbbbbbbbb',
  },
  // Grupos para INF119 (Estructuras Discretas)
  {
    id: 'g1d44444-5555-6666-7777-000000000005',
    nombre: 'SC',
    materiaId: sampleMaterias[1], // INF119
    docenteId: '' as string,
    detalleInscripcionId: 'd1c33333-4444-5555-6666-000000000005',
    aulaGrupoMateriaId: 'c3d5f8a1-1f11-4f2a-9b61-111111111111',
    periodoId: '9b0f2d71-4c4e-4a3b-bbbb-bbbbbbbbbbbb',
  },
  // Grupos para INF110 (Introducción a la Informática)
  {
    id: 'g1d44444-5555-6666-7777-000000000006',
    nombre: 'R1',
    materiaId: sampleMaterias[2], // INF110
    docenteId: '' as string,
    detalleInscripcionId: 'd1c33333-4444-5555-6666-000000000006',
    aulaGrupoMateriaId: 'c3d5f8a1-1f11-4f2a-9b61-222222222222',
    periodoId: '9b0f2d71-4c4e-4a3b-bbbb-cccccccccccc',
  },
];

// Horarios para los grupos de materias
const horarios = [
  // Horarios para MAT-101 grupo SC
  {
    id: 'h1000000-1111-2222-3333-000000000001',
    diaSemana: 'Lunes',
    horaInicio: '08:00',
    horaFin: '10:00',
    grupoMateriaId: 'g1d44444-5555-6666-7777-000000000001', // SC
  },
  {
    id: 'h1000000-1111-2222-3333-000000000002',
    diaSemana: 'Miércoles',
    horaInicio: '08:00',
    horaFin: '10:00',
    grupoMateriaId: 'g1d44444-5555-6666-7777-000000000001', // SC
  },
  {
    id: 'h1000000-1111-2222-3333-000000000003',
    diaSemana: 'Viernes',
    horaInicio: '08:00',
    horaFin: '10:00',
    grupoMateriaId: 'g1d44444-5555-6666-7777-000000000001', // SC
  },
  // Horarios para MAT-101 grupo SA
  {
    id: 'h1000000-1111-2222-3333-000000000004',
    diaSemana: 'Martes',
    horaInicio: '10:00',
    horaFin: '12:00',
    grupoMateriaId: 'g1d44444-5555-6666-7777-000000000002', // SA
  },
  {
    id: 'h1000000-1111-2222-3333-000000000005',
    diaSemana: 'Jueves',
    horaInicio: '10:00',
    horaFin: '12:00',
    grupoMateriaId: 'g1d44444-5555-6666-7777-000000000002', // SA
  },
  // Horarios para MAT-101 grupo SX
  {
    id: 'h1000000-1111-2222-3333-000000000006',
    diaSemana: 'Lunes',
    horaInicio: '14:00',
    horaFin: '16:00',
    grupoMateriaId: 'g1d44444-5555-6666-7777-000000000003', // SX
  },
  {
    id: 'h1000000-1111-2222-3333-000000000007',
    diaSemana: 'Miércoles',
    horaInicio: '14:00',
    horaFin: '16:00',
    grupoMateriaId: 'g1d44444-5555-6666-7777-000000000003', // SX
  },
  // Horarios para MAT-101 grupo NW (Nocturno/Weekend)
  {
    id: 'h1000000-1111-2222-3333-000000000008',
    diaSemana: 'Sábado',
    horaInicio: '08:00',
    horaFin: '12:00',
    grupoMateriaId: 'g1d44444-5555-6666-7777-000000000004', // NW
  },
  // Horarios para INF119 grupo SC
  {
    id: 'h1000000-1111-2222-3333-000000000009',
    diaSemana: 'Martes',
    horaInicio: '08:00',
    horaFin: '10:00',
    grupoMateriaId: 'g1d44444-5555-6666-7777-000000000005', // SC
  },
  {
    id: 'h1000000-1111-2222-3333-000000000010',
    diaSemana: 'Jueves',
    horaInicio: '08:00',
    horaFin: '10:00',
    grupoMateriaId: 'g1d44444-5555-6666-7777-000000000005', // SC
  },
  // Horarios para INF110 grupo R1
  {
    id: 'h1000000-1111-2222-3333-000000000011',
    diaSemana: 'Viernes',
    horaInicio: '14:00',
    horaFin: '18:00',
    grupoMateriaId: 'g1d44444-5555-6666-7777-000000000006', // R1
  },
];

const boletas = [
  {
    id: 'b0e55555-6666-7777-8888-000000000001',
    fichaInscripcionId: 'f1b22222-3333-4444-5555-000000000001',
    avanceAcademicoId: '5d8c9f2e-6f55-4c1d-aaaa-dddddddddddd',
  },
  {
    id: 'b0e55555-6666-7777-8888-000000000002',
    fichaInscripcionId: 'f1b22222-3333-4444-5555-000000000002',
    avanceAcademicoId: '5d8c9f2e-6f55-4c1d-aaaa-eeeeeeeeeeee',
  },
];

async function main() {
  console.log('Iniciando seed...');

  // Wrap each block to detect silent failures
  const carreraResult = await prisma.carrera.createMany({
    data: carreras,
    skipDuplicates: true,
  });
  console.log(`Carreras insertadas (nuevas): ${carreraResult.count}`);

  const planResult = await prisma.planDeEstudio.createMany({
    data: planesDeEstudio,
    skipDuplicates: true,
  });
  console.log(`Planes de estudio insertados (nuevos): ${planResult.count}`);

  const nivelResult = await prisma.nivel.createMany({
    data: niveles,
    skipDuplicates: true,
  });
  console.log(`Niveles insertados (nuevos): ${nivelResult.count}`);

  const materiaResult = await prisma.materia.createMany({
    data: materias,
    skipDuplicates: true,
  });
  console.log(`Materias insertadas (nuevas): ${materiaResult.count}`);

  const prereqResult = await prisma.prerequisito.createMany({
    data: prerequisitos,
    skipDuplicates: true,
  });
  console.log(`Prerequisitos insertados (nuevos): ${prereqResult.count}`);

  const hashed = await bcrypt.hash('Password123!', 10);
  const docentesResult = await prisma.docente.createMany({
    data: docentesBase.map((d) => ({ ...d, password: hashed })),
    skipDuplicates: true,
  });
  console.log(`Docentes insertados (nuevos): ${docentesResult.count}`);

  // Mostrar totales actuales
  const [
    totalCarreras,
    totalPlanes,
    totalNiveles,
    totalMaterias,
    totalPrereq,
    totalDocentes,
  ] = await Promise.all([
    prisma.carrera.count(),
    prisma.planDeEstudio.count(),
    prisma.nivel.count(),
    prisma.materia.count(),
    prisma.prerequisito.count(),
    prisma.docente.count(),
  ]);
  console.log('Totales en la BD:');
  console.table({
    totalCarreras,
    totalPlanes,
    totalNiveles,
    totalMaterias,
    totalPrereq,
    totalDocentes,
  });

  // ---- Nuevos modelos ----
  console.log('Seeding modelos restantes...');

  const moduloResult = await prisma.modulo.createMany({
    data: modulos,
    skipDuplicates: true,
  });
  console.log(`Modulos insertados (nuevos): ${moduloResult.count}`);

  const agmResult = await prisma.aulaGrupoMateria.createMany({
    data: aulaGrupoMaterias,
    skipDuplicates: true,
  });
  console.log(`AulaGrupoMateria insertados (nuevos): ${agmResult.count}`);

  const aulaResult = await prisma.aula.createMany({
    data: aulas,
    skipDuplicates: true,
  });
  console.log(`Aulas insertadas (nuevas): ${aulaResult.count}`);

  const gestionResult = await prisma.gestion.createMany({
    data: gestiones,
    skipDuplicates: true,
  });
  console.log(`Gestiones insertadas (nuevas): ${gestionResult.count}`);

  const periodoResult = await prisma.periodo.createMany({
    data: periodos,
    skipDuplicates: true,
  });
  console.log(`Periodos insertados (nuevos): ${periodoResult.count}`);

  const avanceResult = await prisma.avanceAcademico.createMany({
    data: avances,
    skipDuplicates: true,
  });
  console.log(`Avances insertados (nuevos): ${avanceResult.count}`);

  const hashedEst = await bcrypt.hash('Password123!', 10);
  const estudianteResult = await prisma.estudiante.createMany({
    data: estudiantesSeed.map((e) => ({ ...e, password: hashedEst })),
    skipDuplicates: true,
  });
  console.log(`Estudiantes insertados (nuevos): ${estudianteResult.count}`);

  const fichaResult = await prisma.fichaInscripcion.createMany({
    data: fichasInscripcion,
    skipDuplicates: true,
  });
  console.log(`FichasInscripcion insertadas (nuevas): ${fichaResult.count}`);

  const detalleResult = await prisma.detalleInscripcion.createMany({
    data: detallesInscripcion,
    skipDuplicates: true,
  });
  console.log(
    `DetallesInscripcion insertados (nuevos): ${detalleResult.count}`,
  );

  // Obtener un listado de docentes para asignar a los grupos (al menos 6 existen)
  const docentes = await prisma.docente.findMany({
    take: 6,
    orderBy: { createdAt: 'asc' },
  });
  if (docentes.length < 6) {
    throw new Error('No hay suficientes docentes para crear GrupoMateria');
  }
  grupoMaterias[0].docenteId = docentes[0].id; // MAT-101 SC
  grupoMaterias[1].docenteId = docentes[1].id; // MAT-101 SA
  grupoMaterias[2].docenteId = docentes[2].id; // MAT-101 SX
  grupoMaterias[3].docenteId = docentes[3].id; // MAT-101 NW
  grupoMaterias[4].docenteId = docentes[4].id; // INF119 SC
  grupoMaterias[5].docenteId = docentes[5].id; // INF110 R1

  const grupoMatResult = await prisma.grupoMateria.createMany({
    data: grupoMaterias as any,
    skipDuplicates: true,
  });
  console.log(`GrupoMateria insertados (nuevos): ${grupoMatResult.count}`);

  // Insertar horarios
  const horarioResult = await prisma.horario.createMany({
    data: horarios,
    skipDuplicates: true,
  });
  console.log(`Horarios insertados (nuevos): ${horarioResult.count}`);

  const boletaResult = await prisma.boletaInscripcion.createMany({
    data: boletas,
    skipDuplicates: true,
  });
  console.log(`BoletasInscripcion insertadas (nuevas): ${boletaResult.count}`);

  const finalCounts = await Promise.all([
    prisma.modulo.count(),
    prisma.aulaGrupoMateria.count(),
    prisma.aula.count(),
    prisma.gestion.count(),
    prisma.periodo.count(),
    prisma.avanceAcademico.count(),
    prisma.estudiante.count(),
    prisma.fichaInscripcion.count(),
    prisma.detalleInscripcion.count(),
    prisma.grupoMateria.count(),
    prisma.boletaInscripcion.count(),
    prisma.horario.count(),
  ]);
  console.table({
    totalModulos: finalCounts[0],
    totalAulaGrupoMateria: finalCounts[1],
    totalAulas: finalCounts[2],
    totalGestiones: finalCounts[3],
    totalPeriodos: finalCounts[4],
    totalAvances: finalCounts[5],
    totalEstudiantes: finalCounts[6],
    totalFichas: finalCounts[7],
    totalDetalles: finalCounts[8],
    totalGrupoMateria: finalCounts[9],
    totalBoletas: finalCounts[10],
    totalHorarios: finalCounts[11],
  });

  console.log('Seed completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
