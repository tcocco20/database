import { proxy } from "./errorHandler.js";

export const coccoData = ((proxy) => {
  const dbSystem = (() => {
    const dbManager = (tier) => {
      const dataBase = {};
      let id = 0;

      const createEntry = () => {
        dataBase[id] = {};
        return id++;
      };

      const newEntry = () => {
        let response = {};

        if (Object.keys(dataBase).length < membership.limit) {
          const newId = createEntry();
          response = { addField: edit(newId).field };
        }

        return proxy(response, "Membership limit reached");
      };

      const edit = (id) => ({ field: addField(id) });
      const addField = (id) => (field, value) => (dataBase[id][field] = value);
      const getAll = () => dataBase;
      const getById = (id) => dataBase[id];
      const remove = (id) => delete dataBase[id];

      const getByField = (field, value) => {
        const results = Object.keys(dataBase)
          .filter((id) => dataBase[id][field] === value)
          .map((id) => {
            const options = {
              id,
              entry: dataBase[id],
              field: edit(id).field,
              remove: remove.bind(null, id),
            };

            return proxy(options);
          });

        let i = 0;

        const next = () => {
          const response = { current: results[i] };
          if (++i < results.length) response.next = next;

          return proxy(response);
        };

        const response = { current: results[i] };
        if (results.length > 1) {
          response.next = next;
          response.all = results;
        }

        return proxy(response);
      };

      const basic = { newEntry, getAll, remove };
      const some = { ...basic, edit, getById };
      const all = { ...some, getByField };

      const access = {
        bronze: {
          features: basic,
          limit: 2,
        },
        silver: {
          features: some,
          limit: 3,
        },
        gold: {
          features: all,
          limit: 4,
        },
      };

      const get = () => {
        if (tier === "bronze") return "bronze";
        if (tier === "silver") return "silver";
        if (tier === "gold") return "gold";
      };

      const membership = access[get()];

      return proxy(
        membership.features,
        "Feature not available to you peasants"
      );
    };

    const signUp = (tier) => dbManager(tier);

    return proxy({ signUp });
  })();

  const createDb = (tier) => () => dbSystem.signUp(tier);

  return proxy({
    bronze: proxy({ create: createDb("bronze") }),
    silver: proxy({ create: createDb("silver") }),
    gold: proxy({ create: createDb("gold") }),
  });
})(proxy);
