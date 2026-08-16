--
-- PostgreSQL database dump
--

\restrict qqHVmrPDPFDTvfk9JKAOJecXHkNrj0matS9YhCl2OuDhhzgzSQoBZTe8uogbXkP

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-08-16 16:00:58

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16546)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16545)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- TOC entry 5073 (class 0 OID 0)
-- Dependencies: 219
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 224 (class 1259 OID 16576)
-- Name: category_fields; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category_fields (
    id integer NOT NULL,
    category_id integer NOT NULL,
    field_id integer NOT NULL,
    display_order integer DEFAULT 0
);


ALTER TABLE public.category_fields OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16575)
-- Name: category_fields_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.category_fields_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.category_fields_id_seq OWNER TO postgres;

--
-- TOC entry 5074 (class 0 OID 0)
-- Dependencies: 223
-- Name: category_fields_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.category_fields_id_seq OWNED BY public.category_fields.id;


--
-- TOC entry 222 (class 1259 OID 16560)
-- Name: fields; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fields (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    label character varying(150) NOT NULL,
    field_type character varying(50) NOT NULL,
    required boolean DEFAULT false,
    placeholder character varying(255),
    default_value text,
    min_value numeric,
    max_value numeric,
    min_length integer,
    max_length integer,
    options jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    conditional_on_field_id integer,
    conditional_on_value text
);


ALTER TABLE public.fields OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16559)
-- Name: fields_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fields_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fields_id_seq OWNER TO postgres;

--
-- TOC entry 5075 (class 0 OID 0)
-- Dependencies: 221
-- Name: fields_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fields_id_seq OWNED BY public.fields.id;


--
-- TOC entry 228 (class 1259 OID 16619)
-- Name: listing_field_values; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.listing_field_values (
    id integer NOT NULL,
    listing_id integer NOT NULL,
    field_id integer NOT NULL,
    value text
);


ALTER TABLE public.listing_field_values OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16618)
-- Name: listing_field_values_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.listing_field_values_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.listing_field_values_id_seq OWNER TO postgres;

--
-- TOC entry 5076 (class 0 OID 0)
-- Dependencies: 227
-- Name: listing_field_values_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.listing_field_values_id_seq OWNED BY public.listing_field_values.id;


--
-- TOC entry 226 (class 1259 OID 16599)
-- Name: listings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.listings (
    id integer NOT NULL,
    category_id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    price numeric(12,2) NOT NULL,
    condition character varying(50),
    images jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.listings OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16598)
-- Name: listings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.listings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.listings_id_seq OWNER TO postgres;

--
-- TOC entry 5077 (class 0 OID 0)
-- Dependencies: 225
-- Name: listings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.listings_id_seq OWNED BY public.listings.id;


--
-- TOC entry 4876 (class 2604 OID 16549)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 4883 (class 2604 OID 16579)
-- Name: category_fields id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_fields ALTER COLUMN id SET DEFAULT nextval('public.category_fields_id_seq'::regclass);


--
-- TOC entry 4879 (class 2604 OID 16563)
-- Name: fields id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fields ALTER COLUMN id SET DEFAULT nextval('public.fields_id_seq'::regclass);


--
-- TOC entry 4888 (class 2604 OID 16622)
-- Name: listing_field_values id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listing_field_values ALTER COLUMN id SET DEFAULT nextval('public.listing_field_values_id_seq'::regclass);


--
-- TOC entry 4885 (class 2604 OID 16602)
-- Name: listings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings ALTER COLUMN id SET DEFAULT nextval('public.listings_id_seq'::regclass);


--
-- TOC entry 5059 (class 0 OID 16546)
-- Dependencies: 220
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, slug, created_at, updated_at) FROM stdin;
1	Mobile Phone	mobile-phone	2026-08-15 14:13:01.786444	2026-08-15 14:13:01.786444
2	Laptop	laptop	2026-08-15 14:13:01.786444	2026-08-15 14:13:01.786444
3	Sofa	sofa	2026-08-15 14:13:01.786444	2026-08-15 14:13:01.786444
5	Tablet	tablet	2026-08-15 20:02:15.261374	2026-08-15 20:02:15.261374
6	Smartwatch	smartwatch	2026-08-15 23:19:41.286846	2026-08-15 23:19:41.286846
7	Digital Camera	digital-camera	2026-08-16 15:22:29.293438	2026-08-16 15:22:29.293438
\.


--
-- TOC entry 5063 (class 0 OID 16576)
-- Dependencies: 224
-- Data for Name: category_fields; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category_fields (id, category_id, field_id, display_order) FROM stdin;
2	1	2	2
3	1	3	3
4	1	4	4
5	1	5	6
6	1	6	5
9	2	5	5
11	2	8	4
12	3	9	1
13	3	10	2
14	3	11	3
15	3	12	4
25	1	16	6
8	2	4	1
10	2	7	3
7	2	3	2
\.


--
-- TOC entry 5061 (class 0 OID 16560)
-- Dependencies: 222
-- Data for Name: fields; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fields (id, name, label, field_type, required, placeholder, default_value, min_value, max_value, min_length, max_length, options, created_at, updated_at, conditional_on_field_id, conditional_on_value) FROM stdin;
2	model	Model	text	t	\N	\N	\N	\N	\N	\N	\N	2026-08-15 14:13:22.91623	2026-08-15 14:13:22.91623	\N	\N
3	storage	Storage	select	t	\N	\N	\N	\N	\N	\N	["64GB", "128GB", "256GB", "512GB", "1TB"]	2026-08-15 14:13:22.91623	2026-08-15 14:13:22.91623	\N	\N
4	ram	RAM	select	t	\N	\N	\N	\N	\N	\N	["4GB", "8GB", "16GB", "32GB"]	2026-08-15 14:13:22.91623	2026-08-15 14:13:22.91623	\N	\N
5	battery_health	Battery Health	number	f	\N	\N	0	100	\N	\N	\N	2026-08-15 14:13:22.91623	2026-08-15 14:13:22.91623	\N	\N
6	original_box	Original Box	checkbox	f	\N	\N	\N	\N	\N	\N	\N	2026-08-15 14:13:22.91623	2026-08-15 14:13:22.91623	\N	\N
7	processor	Processor	text	t	\N	\N	\N	\N	\N	\N	\N	2026-08-15 14:13:22.91623	2026-08-15 14:13:22.91623	\N	\N
8	graphics_card	Graphics Card	text	f	\N	\N	\N	\N	\N	\N	\N	2026-08-15 14:13:22.91623	2026-08-15 14:13:22.91623	\N	\N
9	material	Material	select	t	\N	\N	\N	\N	\N	\N	["Leather", "Fabric", "Velvet", "Wood", "Other"]	2026-08-15 14:13:22.91623	2026-08-15 14:13:22.91623	\N	\N
10	seating_capacity	Seating Capacity	number	t	\N	\N	1	20	\N	\N	\N	2026-08-15 14:13:22.91623	2026-08-15 14:13:22.91623	\N	\N
11	pet_friendly	Pet Friendly	radio	f	\N	\N	\N	\N	\N	\N	["Yes", "No"]	2026-08-15 14:13:22.91623	2026-08-15 14:13:22.91623	\N	\N
12	dimensions	Dimensions	text	t	\N	\N	\N	\N	\N	\N	\N	2026-08-15 14:13:22.91623	2026-08-15 14:13:22.91623	\N	\N
14	lens_mount	Lens Mount	select	t	\N	\N	\N	\N	\N	\N	["EF", "RF", "E-Mount", "Z-Mount"]	2026-08-15 22:55:59.743413	2026-08-15 22:55:59.743413	\N	\N
15	Screen_size	Screen_size	number	t	\N	\N	1	100	\N	\N	\N	2026-08-15 23:24:33.200465	2026-08-15 23:24:33.200465	\N	\N
16	color	Color	select	f	\N	\N	\N	\N	\N	\N	["Black", "White", "Blue", "Red"]	2026-08-15 23:26:14.983689	2026-08-15 23:26:14.983689	\N	\N
13	megapixels	Megapixels	number	t	\N	\N	1	1000	\N	\N	\N	2026-08-15 20:07:39.618347	2026-08-16 13:14:47.02576	\N	\N
\.


--
-- TOC entry 5067 (class 0 OID 16619)
-- Dependencies: 228
-- Data for Name: listing_field_values; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.listing_field_values (id, listing_id, field_id, value) FROM stdin;
2	1	2	6x pro
3	1	3	64GB
4	1	4	4GB
5	1	6	false
6	1	5	83
7	2	2	14pro
8	2	3	128GB
9	2	4	4GB
10	2	6	true
11	2	5	85
12	2	16	Black
\.


--
-- TOC entry 5065 (class 0 OID 16599)
-- Dependencies: 226
-- Data for Name: listings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.listings (id, category_id, title, description, price, condition, images, created_at, updated_at) FROM stdin;
1	1	Oppo- Mobile Phone	-	2500.00	New	\N	2026-08-15 15:02:04.863104	2026-08-15 15:02:04.863104
2	1	Iphone	Its a brand new iphone only 2 months old.	89000.00	New	\N	2026-08-15 23:39:04.993225	2026-08-15 23:39:04.993225
\.


--
-- TOC entry 5078 (class 0 OID 0)
-- Dependencies: 219
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 8, true);


--
-- TOC entry 5079 (class 0 OID 0)
-- Dependencies: 223
-- Name: category_fields_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.category_fields_id_seq', 25, true);


--
-- TOC entry 5080 (class 0 OID 0)
-- Dependencies: 221
-- Name: fields_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fields_id_seq', 16, true);


--
-- TOC entry 5081 (class 0 OID 0)
-- Dependencies: 227
-- Name: listing_field_values_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.listing_field_values_id_seq', 12, true);


--
-- TOC entry 5082 (class 0 OID 0)
-- Dependencies: 225
-- Name: listings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.listings_id_seq', 2, true);


--
-- TOC entry 4890 (class 2606 OID 16556)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4892 (class 2606 OID 16558)
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- TOC entry 4896 (class 2606 OID 16587)
-- Name: category_fields category_fields_category_id_field_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_fields
    ADD CONSTRAINT category_fields_category_id_field_id_key UNIQUE (category_id, field_id);


--
-- TOC entry 4898 (class 2606 OID 16585)
-- Name: category_fields category_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_fields
    ADD CONSTRAINT category_fields_pkey PRIMARY KEY (id);


--
-- TOC entry 4894 (class 2606 OID 16574)
-- Name: fields fields_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fields
    ADD CONSTRAINT fields_pkey PRIMARY KEY (id);


--
-- TOC entry 4902 (class 2606 OID 16631)
-- Name: listing_field_values listing_field_values_listing_id_field_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listing_field_values
    ADD CONSTRAINT listing_field_values_listing_id_field_id_key UNIQUE (listing_id, field_id);


--
-- TOC entry 4904 (class 2606 OID 16629)
-- Name: listing_field_values listing_field_values_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listing_field_values
    ADD CONSTRAINT listing_field_values_pkey PRIMARY KEY (id);


--
-- TOC entry 4900 (class 2606 OID 16612)
-- Name: listings listings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_pkey PRIMARY KEY (id);


--
-- TOC entry 4906 (class 2606 OID 16588)
-- Name: category_fields category_fields_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_fields
    ADD CONSTRAINT category_fields_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- TOC entry 4907 (class 2606 OID 16593)
-- Name: category_fields category_fields_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_fields
    ADD CONSTRAINT category_fields_field_id_fkey FOREIGN KEY (field_id) REFERENCES public.fields(id) ON DELETE CASCADE;


--
-- TOC entry 4905 (class 2606 OID 16642)
-- Name: fields fields_conditional_on_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fields
    ADD CONSTRAINT fields_conditional_on_field_id_fkey FOREIGN KEY (conditional_on_field_id) REFERENCES public.fields(id) ON DELETE SET NULL;


--
-- TOC entry 4909 (class 2606 OID 16637)
-- Name: listing_field_values listing_field_values_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listing_field_values
    ADD CONSTRAINT listing_field_values_field_id_fkey FOREIGN KEY (field_id) REFERENCES public.fields(id) ON DELETE CASCADE;


--
-- TOC entry 4910 (class 2606 OID 16632)
-- Name: listing_field_values listing_field_values_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listing_field_values
    ADD CONSTRAINT listing_field_values_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE;


--
-- TOC entry 4908 (class 2606 OID 16613)
-- Name: listings listings_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


-- Completed on 2026-08-16 16:00:59

--
-- PostgreSQL database dump complete
--

\unrestrict qqHVmrPDPFDTvfk9JKAOJecXHkNrj0matS9YhCl2OuDhhzgzSQoBZTe8uogbXkP

