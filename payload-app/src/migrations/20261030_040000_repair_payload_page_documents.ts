import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/**
 * Repair historic direct-SQL case-study seeds by persisting them through Payload's
 * own Document API. Never overwrite an existing, nonempty Payload page layout.
 * Existing R2 Media records are referenced, not re-uploaded.
 */
type Row = Record<string, any>
const getRows = async (db: MigrateUpArgs['db'], query: string): Promise<Row[]> => {
  const result = await db.execute(sql.raw(query))
  return ((result as unknown as { rows?: Row[] }).rows || [])
}
const lookup = (rows: Row[], id: unknown) => rows.filter(r => String(r._parent_id) === String(id)).sort((a,b) => Number(a._order)-Number(b._order))
export async function up({db,payload}:MigrateUpArgs):Promise<void>{
  const [heroes, briefs, scopes, editorials, groups, chips, facts, images] = await Promise.all([
    getRows(db,'SELECT * FROM pages_blocks_case_study_hero'),
    getRows(db,'SELECT * FROM pages_blocks_case_study_brief'),
    getRows(db,'SELECT * FROM pages_blocks_case_study_scope'),
    getRows(db,'SELECT * FROM pages_blocks_case_study_editorial'),
    getRows(db,'SELECT * FROM pages_blocks_case_study_media_group'),
    getRows(db,'SELECT * FROM pages_blocks_case_study_hero_chips'),
    getRows(db,'SELECT * FROM pages_blocks_case_study_scope_facts'),
    getRows(db,'SELECT * FROM pages_blocks_case_study_media_group_images'),
  ])
  for (const [id,slug] of [[1,'centronic'],[2,'haptix']] as const) {
    const existing = await payload.findByID({collection:'pages',id,depth:0,overrideAccess:true})
    if (existing.slug !== slug) throw new Error('Page identity mismatch: ' + slug)
    const visible = (existing.layout || []).length
    if (visible >= 4) { payload.logger.info('CMS repair skipped: ' + slug + ' already has ' + visible + ' Payload-visible blocks'); continue }
    const entries: {order:number; data:Record<string,unknown>}[]=[]
    const owned = (rows: Row[]) => rows.filter(r => Number(r._parent_id)===id)
    for (const r of owned(heroes)) entries.push({order:Number(r._order),data:{
      blockType:'caseStudyHero',eyebrow:r.eyebrow,client:r.client,period:r.period,role:r.role,title:r.title,
      description:r.description,heroImage:r.hero_image_id||undefined,heroAlt:r.hero_alt,
      chips:lookup(chips,r.id).map(c=>({label:c.label}))
    }})
    for (const r of owned(briefs)) entries.push({order:Number(r._order),data:{
      blockType:'caseStudyBrief',eyebrow:r.eyebrow,heading:r.heading,body:r.body,supportingText:r.supporting_text
    }})
    for (const r of owned(scopes)) entries.push({order:Number(r._order),data:{
      blockType:'caseStudyScope',eyebrow:r.eyebrow,heading:r.heading,sketch:r.sketch_id||undefined,sketchAlt:r.sketch_alt,
      facts:lookup(facts,r.id).map(f=>({label:f.label,value:f.value}))
    }})
    for (const r of owned(editorials)) entries.push({order:Number(r._order),data:{
      blockType:'caseStudyEditorial',eyebrow:r.eyebrow,heading:r.heading,body:r.body,image:r.image_id||undefined,
      imageAlt:r.image_alt,caption:r.caption
    }})
    for (const r of owned(groups)) entries.push({order:Number(r._order),data:{
      blockType:'caseStudyMediaGroup',sectionHeading:r.section_heading,sectionKey:r.section_key,
      layoutStyle:r.layout_style,presentation:r.presentation||undefined,
      gridVariant:r.grid_variant||'two',appearance:r.appearance||'inherit',slideAlignment:r.slide_alignment||'textLeft',
      showSectionHeading:r.show_section_heading??true,showNumbers:r.show_numbers??false,
      images:lookup(images,r.id).map(im=>({
        sourcePath:im.source_path,sourceUrl:im.source_url,media:im.media_id,
        alt:im.alt,caption:im.caption,imageName:im.image_name,
        eyebrow:im.eyebrow,title:im.title,description:im.description,credit:im.credit,
        showEyebrow:im.show_eyebrow??false,showTitle:im.show_title??false,
        showCaption:im.show_caption??true,showDescription:im.show_description??false,showCredit:im.show_credit??false
      }))
    }})
    const layout = entries.sort((a,b)=>a.order-b.order).map(x=>x.data)
    if (layout.length < 8) throw new Error('Incomplete seed recovery: '+slug+' '+layout.length)
    const updated = await payload.update({collection:'pages',id,data:{layout} as any,overrideAccess:true,draft:false,depth:0,context:{skipRevalidate:true}})
    const count=(updated.layout||[]).length
    if(count!==layout.length)throw new Error('Payload update lost blocks '+slug+': '+count+' / '+layout.length)
    payload.logger.info('CMS document repaired through Payload API: '+slug+' '+count+' blocks')
  }
}
export async function down(_args:MigrateDownArgs):Promise<void>{/* User-authored case study content is never removed by rollback. */}
