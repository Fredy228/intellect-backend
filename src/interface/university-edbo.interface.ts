export interface IBranchesEdbo {
  university_name: string;
  university_id: string;
  region_name: string;
  katottgcodeu: string;
  katottg_name: string;
}

export interface IUniversityEbo {
  university_name: string;
  university_id: string;
  university_parent_id: string | null;
  university_short_name: string | null;
  university_name_en: string;
  registration_year: string;
  university_type_name: string;
  university_financing_type_name: string;
  university_governance_type_name: string;
  post_index_u: string;
  katottgcodeu: string;
  katottg_name_u: string;
  region_name_u: string;
  university_address_u: string;
  university_phone: string;
  university_email: string;
  university_site: string;
  university_director_post: string;
  university_director_fio: string;
  branches: Array<IBranchesEdbo>;
  facultets: Array<string>;
}
