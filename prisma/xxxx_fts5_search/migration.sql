-- People + Interactions を横断する全文検索インデックス
CREATE VIRTUAL TABLE IF NOT EXISTS search_index
USING fts5(
  row_type,
  row_id,
  person_id,
  content,
  tokenize='unicode61'
);

-- 初期投入：People
INSERT INTO search_index(row_type, row_id, person_id, content)
SELECT
  'person', p.id, p.id,
  coalesce(p.name,'') || ' ' ||
  coalesce(p.company,'') || ' ' ||
  coalesce(p.email,'') || ' ' ||
  coalesce(p.phone,'') || ' ' ||
  coalesce(p.firstMetHow,'') || ' ' ||
  coalesce(p.appearance,'') || ' ' ||
  coalesce(p.personality,'') || ' ' ||
  coalesce(p.impression,'') || ' ' ||
  coalesce(p.followupPlan,'') || ' ' ||
  (SELECT group_concat(value, ' ') FROM json_each(json(p.tags)))
FROM Person p;

-- 初期投入：Interactions
INSERT INTO search_index(row_type, row_id, person_id, content)
SELECT
  'interaction', i.id, i.personId,
  coalesce(i.talkedAbout,'') || ' ' ||
  coalesce(i.memo,'') || ' ' ||
  coalesce(i.place,'') || ' ' ||
  coalesce(i.context,'')
FROM Interaction i;

-- Peopleトリガー
CREATE TRIGGER IF NOT EXISTS person_ai AFTER INSERT ON Person BEGIN
  INSERT INTO search_index(row_type,row_id,person_id,content)
  VALUES ('person', NEW.id, NEW.id,
    coalesce(NEW.name,'') || ' ' ||
    coalesce(NEW.company,'') || ' ' ||
    coalesce(NEW.email,'') || ' ' ||
    coalesce(NEW.phone,'') || ' ' ||
    coalesce(NEW.firstMetHow,'') || ' ' ||
    coalesce(NEW.appearance,'') || ' ' ||
    coalesce(NEW.personality,'') || ' ' ||
    coalesce(NEW.impression,'') || ' ' ||
    coalesce(NEW.followupPlan,'') || ' ' ||
    (SELECT group_concat(value, ' ') FROM json_each(json(NEW.tags)))
  );
END;
CREATE TRIGGER IF NOT EXISTS person_au AFTER UPDATE ON Person BEGIN
  DELETE FROM search_index WHERE row_type='person' AND row_id=OLD.id;
  INSERT INTO search_index(row_type,row_id,person_id,content)
  VALUES ('person', NEW.id, NEW.id,
    coalesce(NEW.name,'') || ' ' ||
    coalesce(NEW.company,'') || ' ' ||
    coalesce(NEW.email,'') || ' ' ||
    coalesce(NEW.phone,'') || ' ' ||
    coalesce(NEW.firstMetHow,'') || ' ' ||
    coalesce(NEW.appearance,'') || ' ' ||
    coalesce(NEW.personality,'') || ' ' ||
    coalesce(NEW.impression,'') || ' ' ||
    coalesce(NEW.followupPlan,'') || ' ' ||
    (SELECT group_concat(value, ' ') FROM json_each(json(NEW.tags)))
  );
END;
CREATE TRIGGER IF NOT EXISTS person_ad AFTER DELETE ON Person BEGIN
  DELETE FROM search_index WHERE row_type='person' AND row_id=OLD.id;
  DELETE FROM search_index WHERE row_type='interaction' AND person_id=OLD.id;
END;

-- Interactionsトリガー
CREATE TRIGGER IF NOT EXISTS interaction_ai AFTER INSERT ON Interaction BEGIN
  INSERT INTO search_index(row_type,row_id,person_id,content)
  VALUES ('interaction', NEW.id, NEW.personId,
    coalesce(NEW.talkedAbout,'') || ' ' ||
    coalesce(NEW.memo,'') || ' ' ||
    coalesce(NEW.place,'') || ' ' ||
    coalesce(NEW.context,'')
  );
END;
CREATE TRIGGER IF NOT EXISTS interaction_au AFTER UPDATE ON Interaction BEGIN
  DELETE FROM search_index WHERE row_type='interaction' AND row_id=OLD.id;
  INSERT INTO search_index(row_type,row_id,person_id,content)
  VALUES ('interaction', NEW.id, NEW.personId,
    coalesce(NEW.talkedAbout,'') || ' ' ||
    coalesce(NEW.memo,'') || ' ' ||
    coalesce(NEW.place,'') || ' ' ||
    coalesce(NEW.context,'')
  );
END;
CREATE TRIGGER IF NOT EXISTS interaction_ad AFTER DELETE ON Interaction BEGIN
  DELETE FROM search_index WHERE row_type='interaction' AND row_id=OLD.id;
END;
