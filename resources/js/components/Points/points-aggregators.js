export const pointsByPillar = (points, pillars) => {
    let totalPoints = 0;
    let pillarPoints = {};
    for(let pillar of pillars){
        let slug = pillar.name.toLowerCase().replace(/\s+/g,'-');
        pillarPoints[pillar.id] = {name:pillar.name,colour:pillar.colour,slug:slug,points:0,proportion:0,types:{}};
    }
    points.forEach( userPoint => {
        if(userPoint.value){
            totalPoints += parseInt(userPoint.value);
            let points = userPoint.points;
            console.log(points);
            if(points && points.pillar_id){
                pillarPoints[points.pillar_id].points += parseInt(userPoint.value);
                if(!pillarPoints[points.pillar_id].types.hasOwnProperty(points.name)){
                    pillarPoints[points.pillar_id].types[points.name] = 0;
                }
                pillarPoints[points.pillar_id].types[points.name] += parseInt(userPoint.value);
            }
        }
    });
    for(let pillarId in pillarPoints){
        if(totalPoints > 0){
            pillarPoints[pillarId].proportion = pillarPoints[pillarId].points / totalPoints + 0.2;

            if (pillarPoints[pillarId].proportion > 1){
                pillarPoints[pillarId].proportion = 1;
            }
            if(isNaN(pillarPoints[pillarId].proportion)){
                pillarPoints[pillarId].proportion = 0.2;
            }
        }
    }
    return pillarPoints;
};