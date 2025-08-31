/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const materias = [
  {
    id: '2cde4bc0-093e-4c8b-89aa-29e6915cf96b',
    sigla: 'MAT-101',
    nombre: 'Calculo I',
    creditos: 5,
    esElectiva: false,
    nivelId: 'af527c69-db52-4e3e-82d7-200d1d5760f6',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '6b46118c-53be-4b3b-925f-b7a010f54b1b',
    sigla: 'INF119',
    nombre: 'Estructuras Discretas',
    creditos: 5,
    esElectiva: false,
    nivelId: 'af527c69-db52-4e3e-82d7-200d1d5760f6',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '96e2722c-2bbe-4214-bb1e-fd8c2c2ad7cf',
    sigla: 'INF110',
    nombre: 'Introduccion a la informatica',
    creditos: 5,
    esElectiva: false,
    nivelId: 'af527c69-db52-4e3e-82d7-200d1d5760f6',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '5d6b10ff-e71e-455c-99b6-31c7f0f60a3d',
    sigla: 'FIS110',
    nombre: 'Fisica I',
    creditos: 5,
    esElectiva: false,
    nivelId: 'af527c69-db52-4e3e-82d7-200d1d5760f6',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '97170af9-a29f-4750-979f-c4f4a3fa20aa',
    sigla: 'LIN100',
    nombre: 'Ingles Tecnico I',
    creditos: 5,
    esElectiva: false,
    nivelId: 'af527c69-db52-4e3e-82d7-200d1d5760f6',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'bf96d2aa-7a36-4a76-b15b-43b499439f53',
    sigla: 'MAT102',
    nombre: 'Calculo II',
    creditos: 5,
    esElectiva: false,
    nivelId: '8ec6bf45-72b4-4306-b6fa-8ddeb4d588c5',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '2c1a27c9-3e9c-4042-a034-293948bc0765',
    sigla: 'MAT103',
    nombre: 'Algebra Lineal',
    creditos: 5,
    esElectiva: false,
    nivelId: '8ec6bf45-72b4-4306-b6fa-8ddeb4d588c5',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '4a95dd4c-4074-4e85-b7e9-b73b5275bb49',
    sigla: 'INF120',
    nombre: 'Programacion I',
    creditos: 5,
    esElectiva: false,
    nivelId: '8ec6bf45-72b4-4306-b6fa-8ddeb4d588c5',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'bd04afa2-e8c8-4fd1-a9ee-321631b5f7f5',
    sigla: 'FIS102',
    nombre: 'Fisica II',
    creditos: 5,
    esElectiva: false,
    nivelId: '8ec6bf45-72b4-4306-b6fa-8ddeb4d588c5',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'cc1cfcab-b6c2-4eb4-9f65-e336e814bc66',
    sigla: 'LIN101',
    nombre: 'Ingles Tecnico II',
    creditos: 5,
    esElectiva: false,
    nivelId: '8ec6bf45-72b4-4306-b6fa-8ddeb4d588c5',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '989f82b0-1b2a-498c-95ed-3d95c61ba0c8',
    sigla: 'MAT207',
    nombre: 'Ecuaciones Diferenciales',
    creditos: 5,
    esElectiva: false,
    nivelId: 'f333303b-1801-4930-b4a9-080de1a131f8',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '1864140e-7618-420a-a40c-cfbae6570d03',
    sigla: 'INF210',
    nombre: 'Programacion II',
    creditos: 5,
    esElectiva: false,
    nivelId: 'f333303b-1801-4930-b4a9-080de1a131f8',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'e13cc30d-249c-4b57-9b73-5b9c260a1cd1',
    sigla: 'INF211',
    nombre: 'Arquitectura de Computadoras',
    creditos: 5,
    esElectiva: false,
    nivelId: 'f333303b-1801-4930-b4a9-080de1a131f8',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'e6467fb3-cdc7-4e26-a8f2-720c4d65b87c',
    sigla: 'FIS200',
    nombre: 'Fisica III',
    creditos: 5,
    esElectiva: false,
    nivelId: 'f333303b-1801-4930-b4a9-080de1a131f8',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'bdf81de3-0cf1-43fc-899d-71bebd8d8325',
    sigla: 'ADM100',
    nombre: 'Administracion',
    creditos: 4,
    esElectiva: false,
    nivelId: 'f333303b-1801-4930-b4a9-080de1a131f8',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'b0256b0d-704b-432e-a37d-60ed5e1077f8',
    sigla: 'MAT202',
    nombre: 'Probabilidades y Estadisticas I',
    creditos: 5,
    esElectiva: false,
    nivelId: 'a27ef1ea-fded-4495-b50c-453f256e5322',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '04cfd4a6-0050-473d-be0a-7374044ebda2',
    sigla: 'MAT205',
    nombre: 'Metodos Numericos',
    creditos: 5,
    esElectiva: false,
    nivelId: 'a27ef1ea-fded-4495-b50c-453f256e5322',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '5ebb0457-b52e-4681-b4fd-458ada52e0b6',
    sigla: 'INF220',
    nombre: 'Estructura de Datos I',
    creditos: 5,
    esElectiva: false,
    nivelId: 'a27ef1ea-fded-4495-b50c-453f256e5322',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'fe46266e-7138-41dd-8efd-5d602331ad73',
    sigla: 'INF221',
    nombre: 'Programacion Ensamblador',
    creditos: 5,
    esElectiva: false,
    nivelId: 'a27ef1ea-fded-4495-b50c-453f256e5322',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'c26b41f0-9df0-480f-bd1b-e286a14ffbcd',
    sigla: 'ADM200',
    nombre: 'Contabilidad',
    creditos: 4,
    esElectiva: false,
    nivelId: 'a27ef1ea-fded-4495-b50c-453f256e5322',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'ac746e01-a05c-402a-8e7f-44807ad62de8',
    sigla: 'MAT302',
    nombre: 'Probabilidades y Estadisticas II',
    creditos: 5,
    esElectiva: false,
    nivelId: '637f890f-b5e6-48da-8511-584707879ea1',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '65cc4843-1a24-4905-8dfc-6f6cd0949951',
    sigla: 'INF318',
    nombre: 'Programacion Logica y Funcional',
    creditos: 5,
    esElectiva: false,
    nivelId: '637f890f-b5e6-48da-8511-584707879ea1',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '6278d8ee-143f-40c6-bfd6-77667fb39ee8',
    sigla: 'INF310',
    nombre: 'Estructura de Datos II',
    creditos: 5,
    esElectiva: false,
    nivelId: '637f890f-b5e6-48da-8511-584707879ea1',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '372ec911-23cf-4394-80b5-61f1046626a1',
    sigla: 'INF312',
    nombre: 'Base de Datos I',
    creditos: 5,
    esElectiva: false,
    nivelId: '637f890f-b5e6-48da-8511-584707879ea1',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'b011661e-2d17-4669-8174-e81ae6780889',
    sigla: 'INF319',
    nombre: 'Lenguajes Formales',
    creditos: 5,
    esElectiva: false,
    nivelId: '637f890f-b5e6-48da-8511-584707879ea1',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'a851a087-fead-488b-b78b-87f035adc954',
    sigla: 'MAT329',
    nombre: 'Investigacion Operativa I',
    creditos: 5,
    esElectiva: false,
    nivelId: '5116c73b-93f5-45cc-98b5-0d4c7f81b958',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'fc449a17-e78e-4313-958b-eeeafaaed4ed',
    sigla: 'INF342',
    nombre: 'Sistemas de Informacion I',
    creditos: 5,
    esElectiva: false,
    nivelId: '5116c73b-93f5-45cc-98b5-0d4c7f81b958',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '785a58e2-d6b1-475f-ac51-607790622a40',
    sigla: 'INF323',
    nombre: 'Sistemas Operativos I',
    creditos: 5,
    esElectiva: false,
    nivelId: '5116c73b-93f5-45cc-98b5-0d4c7f81b958',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'e9c4b64d-6143-4a46-a099-110f20733890',
    sigla: 'INF322',
    nombre: 'Base de Datos II',
    creditos: 5,
    esElectiva: false,
    nivelId: '5116c73b-93f5-45cc-98b5-0d4c7f81b958',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'b14a91ea-c91c-42cd-ba8a-3dbf56ecb84a',
    sigla: 'INF329',
    nombre: 'Compiladores',
    creditos: 5,
    esElectiva: false,
    nivelId: '5116c73b-93f5-45cc-98b5-0d4c7f81b958',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'f8edc2c6-a152-47c1-b688-9cc38bc9de19',
    sigla: 'MAT419',
    nombre: 'Investigacion Operativa II',
    creditos: 5,
    esElectiva: false,
    nivelId: '9c7bc65d-7870-4961-a192-5d7b3a571861',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '5c16eaf5-8032-4c26-a04a-275239294aad',
    sigla: 'INF418',
    nombre: 'Inteligencia Artificial',
    creditos: 5,
    esElectiva: false,
    nivelId: '9c7bc65d-7870-4961-a192-5d7b3a571861',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '956c275c-3dc7-4b48-9aeb-f9f95cce13ab',
    sigla: 'INF413',
    nombre: 'Sistemas Operativos II',
    creditos: 5,
    esElectiva: false,
    nivelId: '9c7bc65d-7870-4961-a192-5d7b3a571861',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '2425af82-30e6-46db-8aa7-3b403201da63',
    sigla: 'INF433',
    nombre: 'Redes I',
    creditos: 5,
    esElectiva: false,
    nivelId: '9c7bc65d-7870-4961-a192-5d7b3a571861',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '728022be-790d-42c0-93c6-2139d681c555',
    sigla: 'INF412',
    nombre: 'Sistemas de Informacion II',
    creditos: 5,
    esElectiva: false,
    nivelId: '9c7bc65d-7870-4961-a192-5d7b3a571861',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '48361832-0bb0-4bd1-ac42-eb3fbbe25d8b',
    sigla: 'INF428',
    nombre: 'Sistemas Expertos',
    creditos: 5,
    esElectiva: false,
    nivelId: '68f3cfff-a137-440b-84e6-00ad3bdbbc4e',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '7ff17e90-07aa-4ceb-abd4-19804723a531',
    sigla: 'INF442',
    nombre: 'Sistemas de Informacion Geografica',
    creditos: 4,
    esElectiva: false,
    nivelId: '68f3cfff-a137-440b-84e6-00ad3bdbbc4e',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '9d2e0a42-9237-42a4-bff3-0ad6987f75a8',
    sigla: 'INF423',
    nombre: 'Redes II',
    creditos: 5,
    esElectiva: false,
    nivelId: '68f3cfff-a137-440b-84e6-00ad3bdbbc4e',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '53a63d12-05b7-4be7-8e28-6f300db3d2d6',
    sigla: 'INF422',
    nombre: 'Ingenieria de Software I',
    creditos: 5,
    esElectiva: false,
    nivelId: '68f3cfff-a137-440b-84e6-00ad3bdbbc4e',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'cb30a8fa-ee4e-4c1a-a00d-ff6dd04a677c',
    sigla: 'INF511',
    nombre: 'Taller de Grado I',
    creditos: 5,
    esElectiva: false,
    nivelId: 'dce5cf69-ff9f-4588-9751-94bc3feee673',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '72024d66-3707-4376-98ed-0b9b97f520a1',
    sigla: 'INF512',
    nombre: 'Ingenieria de Software II',
    creditos: 5,
    esElectiva: false,
    nivelId: 'dce5cf69-ff9f-4588-9751-94bc3feee673',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'c16f1f87-686f-4d1a-924b-a76e3b529de8',
    sigla: 'INF513',
    nombre: 'Tecnologia Web',
    creditos: 5,
    esElectiva: false,
    nivelId: 'dce5cf69-ff9f-4588-9751-94bc3feee673',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'f86db3c4-0685-4a25-a0b4-fc97778515a1',
    sigla: 'INF552',
    nombre: 'Arquitectura de Software',
    creditos: 5,
    esElectiva: false,
    nivelId: 'dce5cf69-ff9f-4588-9751-94bc3feee673',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: 'ea8f37c6-cd0f-475c-9664-cc2eb30431a8',
    sigla: 'GRL001',
    nombre: 'Modalidad Licenciatura',
    creditos: 5,
    esElectiva: false,
    nivelId: '274fe6e9-e299-4758-ad39-e92037f39bc3',
    planDeEstudioId: '32d85f90-61f9-449d-ba73-7b186810fc93',
  },
  {
    id: '1f552415-fe58-40ee-89e8-c145dab40c31',
    sigla: 'ECO449',
    nombre: 'Preparacion y Evaluacion de Proyectos',
    creditos: 5,
    esElectiva: false,
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

const modulos = [{ id: '4e9e7f2d-6d8a-41d3-9d2a-b5a1b6b60236', numero: 236 }];

const gestiones = [{ id: '7a7c4c88-9c2a-4e74-9c1b-aaaaaaaaaaaa', año: '2025' }];

// Datos estáticos
const carreras = [
  {
    id: '3cc60551-e259-4b60-8047-5d3b1a324e53',
    codigo: 187,
    nombre: 'INGENIERIA INFORMATICA',
  },
];

const planesDeEstudio = [
  {
    id: '32d85f90-61f9-449d-ba73-7b186810fc93',
    version: 3,
    carreraId: '3cc60551-e259-4b60-8047-5d3b1a324e53',
  },
];

const niveles = [
  {
    id: 'af527c69-db52-4e3e-82d7-200d1d5760f6',
    semestre: 1,
  },
  { id: '8ec6bf45-72b4-4306-b6fa-8ddeb4d588c5', semestre: 2 },
  { id: 'f333303b-1801-4930-b4a9-080de1a131f8', semestre: 3 },
  { id: 'a27ef1ea-fded-4495-b50c-453f256e5322', semestre: 4 },
  { id: '637f890f-b5e6-48da-8511-584707879ea1', semestre: 5 },
  { id: '5116c73b-93f5-45cc-98b5-0d4c7f81b958', semestre: 6 },
  { id: '9c7bc65d-7870-4961-a192-5d7b3a571861', semestre: 7 },
  { id: '68f3cfff-a137-440b-84e6-00ad3bdbbc4e', semestre: 8 },
  { id: 'dce5cf69-ff9f-4588-9751-94bc3feee673', semestre: 9 },
  {
    id: '274fe6e9-e299-4758-ad39-e92037f39bc3',
    semestre: 10,
  },
];

niveles.push();

async function main() {
  //VACIAR LA BASE DE DATOS ANTES
  await prisma.prerequisito.deleteMany({});
  await prisma.materia.deleteMany({});
  await prisma.nivel.deleteMany({});
  await prisma.planDeEstudio.deleteMany({});
  await prisma.modulo.deleteMany({});
  await prisma.carrera.deleteMany({});
  await prisma.gestion.deleteMany({});

  // Insertar datos base primero (sin dependencias)
  await prisma.gestion.createMany({ data: gestiones });
  await prisma.carrera.createMany({ data: carreras });
  await prisma.modulo.createMany({ data: modulos });

  // Insertar planes de estudio (depende de carreras)
  await prisma.planDeEstudio.createMany({ data: planesDeEstudio });

  // Insertar niveles (sin dependencias)
  await prisma.nivel.createMany({ data: niveles });

  // Ahora insertar materias (depende de niveles y planes de estudio)
  await prisma.materia.createMany({ data: materias });

  // Finalmente insertar prerequisitos (depende de materias)
  await prisma.prerequisito.createMany({ data: prerequisitos });

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
